import WidgetKit

struct TodoItem: Codable, Identifiable {
    let id: String
    let title: String
    let isCompleted: Bool
}

struct WidgetTodoData: Codable {
    let todos: [TodoItem]
    let date: String
    let rate: Double
    let total: Int
    let completed: Int
    let lastUpdated: String?
}

struct TodoEntry: TimelineEntry {
    let date: Date
    let todos: [TodoItem]
    let completedCount: Int
    let totalCount: Int
    let rate: Double
    let dateString: String
    let isPlaceholder: Bool
    /// 위젯 세션이 없거나 만료됨 — 오래된 캐시 대신 로그인 안내를 표시
    var needsLogin: Bool = false
    /// 날짜가 바뀌었는데 아직 오늘 목록을 받지 못함 — 어제 목록을 계속 보여주지 않도록
    var isLoadingNewDay: Bool = false

    static var placeholder: TodoEntry {
        TodoEntry(
            date: Date(),
            todos: [
                TodoItem(id: "1", title: "운동하기", isCompleted: true),
                TodoItem(id: "2", title: "책 읽기", isCompleted: true),
                TodoItem(id: "3", title: "코드 리뷰", isCompleted: false),
                TodoItem(id: "4", title: "블로그 쓰기", isCompleted: false),
            ],
            completedCount: 2,
            totalCount: 4,
            rate: 50,
            dateString: "",
            isPlaceholder: true
        )
    }

    static var signedOut: TodoEntry {
        TodoEntry(
            date: Date(),
            todos: [],
            completedCount: 0,
            totalCount: 0,
            rate: 0,
            dateString: formatTodayString(),
            isPlaceholder: false,
            needsLogin: true
        )
    }

    /// 자정에 표시할 화면 — iOS가 위젯 갱신을 늦춰도 0시가 되면 어제 목록을 내림
    static func newDay(at date: Date) -> TodoEntry {
        TodoEntry(
            date: date,
            todos: [],
            completedCount: 0,
            totalCount: 0,
            rate: 0,
            dateString: formatDateString(date),
            isPlaceholder: false,
            isLoadingNewDay: true
        )
    }

    static var empty: TodoEntry {
        TodoEntry(
            date: Date(),
            todos: [],
            completedCount: 0,
            totalCount: 0,
            rate: 0,
            dateString: formatTodayString(),
            isPlaceholder: false
        )
    }

    private static func formatTodayString() -> String {
        formatDateString(Date())
    }

    private static func formatDateString(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }
}
