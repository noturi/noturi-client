import WidgetKit

struct TodoTimelineProvider: TimelineProvider {
    typealias Entry = TodoEntry

    func placeholder(in context: Context) -> TodoEntry {
        NSLog("[NoturiWidget] placeholder called")
        return TodoEntry.placeholder
    }

    func getSnapshot(in context: Context, completion: @escaping (TodoEntry) -> Void) {
        NSLog("[NoturiWidget] getSnapshot called")
        let defaults = UserDefaults(suiteName: "group.com.noturi.app")
        let raw = defaults?.string(forKey: "widgetTodoData")
        NSLog("[NoturiWidget] [Snapshot] UserDefaults exists: \(defaults != nil), raw data: \(raw != nil), length: \(raw?.count ?? 0)")
        let cached = createEntryFromCache()
        NSLog("[NoturiWidget] [Snapshot] cached data: \(cached != nil)")
        let entry = cached ?? TodoEntry.placeholder
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<TodoEntry>) -> Void) {
        NSLog("[NoturiWidget] getTimeline called")

        Task {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            formatter.timeZone = TimeZone.current
            let today = formatter.string(from: Date())

            // 1. API에서 fresh data fetch 시도
            NSLog("[NoturiWidget] Fetching fresh data for: \(today)")
            let freshData = await TodoWidgetService.fetchTodos(for: today)
            NSLog("[NoturiWidget] Fresh data: \(freshData != nil), todos: \(freshData?.todos.count ?? 0)")

            // 2. 실패하면 캐시 fallback
            let data = freshData ?? SharedDataManager.getTodoData()
            NSLog("[NoturiWidget] Final data: \(data != nil), todos: \(data?.todos.count ?? 0)")

            let entry: TodoEntry
            if let data = data {
                entry = TodoEntry(
                    date: Date(),
                    todos: data.todos,
                    completedCount: data.completed,
                    totalCount: data.total,
                    rate: data.rate,
                    dateString: data.date,
                    isPlaceholder: false
                )
            } else {
                entry = TodoEntry.empty
            }

            let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
            let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
            completion(timeline)
        }
    }

    private func createEntryFromCache() -> TodoEntry? {
        guard let data = SharedDataManager.getTodoData() else { return nil }
        return TodoEntry(
            date: Date(),
            todos: data.todos,
            completedCount: data.completed,
            totalCount: data.total,
            rate: data.rate,
            dateString: data.date,
            isPlaceholder: false
        )
    }
}
