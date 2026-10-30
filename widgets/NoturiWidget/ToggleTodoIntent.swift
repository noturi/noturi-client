import AppIntents
import WidgetKit

@available(iOS 17.0, *)
struct ToggleTodoIntent: AppIntent {
    static var title: LocalizedStringResource = "할 일 완료 토글"
    static var description: IntentDescription = IntentDescription("할 일의 완료 상태를 바꿉니다")

    @Parameter(title: "Todo ID")
    var todoId: String

    init() {}

    init(todoId: String) {
        self.todoId = todoId
    }

    func perform() async throws -> some IntentResult {
        // 낙관적 업데이트 — perform이 끝나면 위젯이 다시 그려지며 getTimeline이 서버 기준으로 재조회
        // (여기서 재조회까지 기다리면 탭 후 반영이 요청 2번만큼 늦어짐)
        // 자정이 지나도 위젯이 어제 목록을 보여주고 있을 수 있음 — 어제 할 일(이월 전 원본)을 완료하면
        // 앱의 오늘 할 일(이월된 복사본)은 체크되지 않으므로, 완료하지 않고 오늘 목록을 다시 불러옴
        guard let previous = SharedDataManager.getTodoData(),
              previous.date == TodoTimelineProvider.todayString() else {
            WidgetCenter.shared.reloadAllTimelines()
            return .result()
        }
        SharedDataManager.saveTodoData(Self.toggled(previous, id: todoId))

        if await !TodoWidgetService.toggleTodo(id: todoId) {
            // 실패하면 되돌림 — 네트워크 실패 시 getTimeline이 캐시를 쓰므로 거짓 완료가 남지 않게
            SharedDataManager.saveTodoData(previous)
        }

        WidgetCenter.shared.reloadAllTimelines()
        return .result()
    }

    private static func toggled(_ data: WidgetTodoData, id: String) -> WidgetTodoData {
        let todos = data.todos.map { todo in
            todo.id == id ? TodoItem(id: todo.id, title: todo.title, isCompleted: !todo.isCompleted) : todo
        }
        let completed = todos.filter { $0.isCompleted }.count
        return WidgetTodoData(
            todos: todos,
            date: data.date,
            rate: todos.isEmpty ? 0 : Double(completed) / Double(todos.count) * 100,
            total: todos.count,
            completed: completed,
            lastUpdated: ISO8601DateFormatter().string(from: Date())
        )
    }
}
