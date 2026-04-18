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
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }
}
