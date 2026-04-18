import SwiftUI
import WidgetKit

struct TodoWidgetMediumView: View {
    let entry: TodoEntry

    private var displayDate: String {
        guard !entry.isPlaceholder else { return "3월 28일" }
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: entry.dateString) else { return entry.dateString }
        formatter.dateFormat = "M월 d일"
        return formatter.string(from: date)
    }

    private var displayTodos: [TodoItem] {
        let sorted = entry.todos.sorted { !$0.isCompleted && $1.isCompleted }
        return Array(sorted.prefix(4))
    }

    var body: some View {
        if #available(iOS 17.0, *) {
            content
                .containerBackground(.fill.tertiary, for: .widget)
        } else {
            content
                .padding()
                .background(Color(.systemBackground))
        }
    }

    private var content: some View {
        VStack(alignment: .leading, spacing: 6) {
            // Header
            HStack {
                Text("Noturi")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.primary)

                Spacer()

                Text("\(entry.completedCount)/\(entry.totalCount) 완료")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.secondary)

                Text("\(Int(entry.rate))%")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.blue)
            }

            Divider()

            // Todo list
            if displayTodos.isEmpty {
                Spacer()
                HStack {
                    Spacer()
                    Text("오늘의 할 일이 없습니다")
                        .font(.system(size: 13))
                        .foregroundColor(.secondary)
                    Spacer()
                }
                Spacer()
            } else {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(displayTodos) { todo in
                        if #available(iOS 17.0, *) {
                            Button(intent: ToggleTodoIntent(todoId: todo.id)) {
                                todoRow(todo)
                            }
                            .buttonStyle(.plain)
                        } else {
                            Link(destination: URL(string: "noturiclient://todo/toggle/\(todo.id)")!) {
                                todoRow(todo)
                            }
                        }
                    }
                }
                if entry.totalCount > 4 {
                    Text("+\(entry.totalCount - 4)개 더")
                        .font(.system(size: 11))
                        .foregroundColor(.secondary)
                }
            }

            Spacer(minLength: 0)
        }
        .widgetURL(URL(string: "noturiclient://todo"))
    }

    private func todoRow(_ todo: TodoItem) -> some View {
        HStack(spacing: 8) {
            Image(systemName: todo.isCompleted ? "checkmark.circle.fill" : "circle")
                .font(.system(size: 16))
                .foregroundColor(todo.isCompleted ? .blue : .gray.opacity(0.4))

            Text(todo.title)
                .font(.system(size: 13))
                .foregroundColor(todo.isCompleted ? .secondary : .primary)
                .strikethrough(todo.isCompleted)
                .lineLimit(1)

            Spacer()
        }
        .contentShape(Rectangle())
    }
}
