import WidgetKit

struct TodoTimelineProvider: TimelineProvider {
    typealias Entry = TodoEntry

    /// 서버에서 다시 받아오는 주기
    private static let refreshInterval: TimeInterval = 15 * 60

    func placeholder(in context: Context) -> TodoEntry {
        TodoEntry.placeholder
    }

    func getSnapshot(in context: Context, completion: @escaping (TodoEntry) -> Void) {
        completion(cachedEntry(for: Self.todayString()) ?? TodoEntry.placeholder)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<TodoEntry>) -> Void) {
        Task {
            let today = Self.todayString()

            let entry: TodoEntry
            switch await TodoWidgetService.fetchTodos(for: today) {
            case .success(let data):
                entry = Self.makeEntry(from: data)
            case .unauthorized:
                // 세션이 없거나 만료 — 다른 계정/오래된 할 일을 보여주지 않도록 캐시 삭제
                SharedDataManager.clearTodoData()
                entry = TodoEntry.signedOut
            case .failure:
                // 네트워크 실패 시 오늘 날짜의 캐시만 사용 (자정이 지난 어제 데이터는 표시하지 않음)
                entry = cachedEntry(for: today) ?? TodoEntry.empty
            }

            // 자정 화면을 미리 넣어 둠 — 자정 갱신이 늦어져도 어제 목록이 남아 체크되지 않게
            var entries = [entry]
            if !entry.needsLogin, let midnight = Self.nextMidnight() {
                entries.append(TodoEntry.newDay(at: midnight))
            }
            completion(Timeline(entries: entries, policy: .after(Self.nextRefreshDate())))
        }
    }

    private func cachedEntry(for date: String) -> TodoEntry? {
        guard let data = SharedDataManager.getTodoData(), data.date == date else { return nil }
        return Self.makeEntry(from: data)
    }

    private static func makeEntry(from data: WidgetTodoData) -> TodoEntry {
        TodoEntry(
            date: Date(),
            todos: data.todos,
            completedCount: data.completed,
            totalCount: data.total,
            rate: data.rate,
            dateString: data.date,
            isPlaceholder: false
        )
    }

    /// 15분 뒤와 다음 자정 중 빠른 시각 — 날짜가 바뀌면 바로 오늘 할 일로 갱신
    private static func nextRefreshDate(now: Date = Date()) -> Date {
        let regular = now.addingTimeInterval(refreshInterval)
        let calendar = Calendar.current
        guard let midnight = calendar.nextDate(
            after: now,
            matching: DateComponents(hour: 0, minute: 0, second: 5),
            matchingPolicy: .nextTime
        ) else {
            return regular
        }
        return min(regular, midnight)
    }

    private static func nextMidnight(now: Date = Date()) -> Date? {
        let calendar = Calendar.current
        return calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: now))
    }

    static func todayString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.timeZone = TimeZone.current
        return formatter.string(from: Date())
    }
}
