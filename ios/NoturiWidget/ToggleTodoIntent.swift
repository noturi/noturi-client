import AppIntents
import WidgetKit

@available(iOS 17.0, *)
struct ToggleTodoIntent: AppIntent {
    static var title: LocalizedStringResource = "투두 토글"
    static var description: IntentDescription = IntentDescription("투두 완료 상태를 토글합니다")

    @Parameter(title: "Todo ID")
    var todoId: String

    init() {}

    init(todoId: String) {
        self.todoId = todoId
    }

    func perform() async throws -> some IntentResult {
        let success = await TodoWidgetService.toggleTodo(id: todoId)

        if success {
            // 낙관적 업데이트: 서버 재조회 전까지 위젯에 바로 반영
            if let todoData = SharedDataManager.getTodoData() {
                var updatedTodos = todoData.todos
                if let index = updatedTodos.firstIndex(where: { $0.id == todoId }) {
                    let todo = updatedTodos[index]
                    updatedTodos[index] = TodoItem(id: todo.id, title: todo.title, isCompleted: !todo.isCompleted)
                }
                let completedCount = updatedTodos.filter { $0.isCompleted }.count
                let total = updatedTodos.count
                let rate = total > 0 ? Double(completedCount) / Double(total) * 100 : 0
                let updated = WidgetTodoData(
                    todos: updatedTodos,
                    date: todoData.date,
                    rate: rate,
                    total: total,
                    completed: completedCount,
                    lastUpdated: ISO8601DateFormatter().string(from: Date())
                )
                SharedDataManager.saveTodoData(updated)
            }

            // 서버 기준으로 다시 동기화
            _ = await TodoWidgetService.fetchTodos(for: TodoTimelineProvider.todayString())
        }

        WidgetCenter.shared.reloadAllTimelines()
        return .result()
    }
}
