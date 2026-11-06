import SwiftUI
import WidgetKit

/// 할 일 목록 위젯 (중형·대형) — 행을 탭하면 위젯 안에서 바로 완료 처리 (iOS 17+)
struct TodoWidgetListView: View {
    let entry: TodoEntry
    /// 표시할 최대 개수 — 중형 4, 대형 10
    let maxCount: Int

    private var displayDate: String {
        guard !entry.isPlaceholder else { return "3월 28일" }
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: entry.dateString) else { return entry.dateString }
        formatter.dateFormat = "M월 d일"
        return formatter.string(from: date)
    }

    /// 오늘 할 일을 모두 완료 — 목록 위에 캐릭터 축하 줄 표시
    private var isAllDone: Bool {
        !entry.isLoadingNewDay && entry.totalCount > 0 && entry.completedCount == entry.totalCount
    }

    private var displayTodos: [TodoItem] {
        let sorted = entry.todos.sorted { !$0.isCompleted && $1.isCompleted }
        // 축하 줄이 행 2개 높이를 차지 — 중형 높이를 넘치지 않도록 그만큼 덜 보여줌 (나머지는 +N)
        let limit = isAllDone ? max(maxCount - 2, 1) : maxCount
        return Array(sorted.prefix(limit))
    }

    var body: some View {
        if #available(iOS 17.0, *) {
            // widgetURL은 위젯 전체에 걸려 체크 버튼 주변을 탭해도 앱이 열림 → 헤더만 링크로
            content
                .containerBackground(.fill.tertiary, for: .widget)
        } else {
            content
                .padding()
                .background(Color(.systemBackground))
                .widgetURL(Self.todoURL)
        }
    }

    private static let todoURL = URL(string: "noturiclient://todo")!

    private var content: some View {
        VStack(alignment: .leading, spacing: 6) {
            // Header — 탭하면 앱의 할 일 탭
            Link(destination: Self.todoURL) {
                header
            }

            Divider()

            // Todo list
            if displayTodos.isEmpty {
                Link(destination: Self.todoURL) {
                    if entry.isLoadingNewDay {
                        Text("오늘 할 일을 불러오는 중이에요")
                            .font(.system(size: 13))
                            .foregroundColor(.secondary)
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    } else {
                        HStack(spacing: 8) {
                            NoturiMarkImage(name: "NoturiMark", size: 32)
                            Text("오늘의 할 일이 없습니다")
                                .font(.system(size: 13))
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    }
                }
            } else {
                if isAllDone {
                    Link(destination: Self.todoURL) {
                        HStack(spacing: 8) {
                            NoturiMarkImage(name: "NoturiMarkDone", size: 32)
                            Text("오늘 할 일 끝!")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.primary)
                            Spacer(minLength: 0)
                        }
                    }
                }

                // 행 사이 틈도 버튼이 받도록 간격 대신 행 패딩
                VStack(alignment: .leading, spacing: 0) {
                    ForEach(displayTodos) { todo in
                        // 더 있는 개수는 마지막 행 끝에 — 별도 줄을 두면 중형 높이를 넘쳐 체크 버튼이 탭되지 않음
                        let hiddenCount = todo.id == displayTodos.last?.id ? entry.totalCount - displayTodos.count : 0
                        if #available(iOS 17.0, *) {
                            // invalidatableContent는 버튼 바깥에 — 라벨 안에 두면 홈 화면에서 탭이 버튼으로 전달되지 않음
                            Button(intent: ToggleTodoIntent(todoId: todo.id)) {
                                todoRow(todo, hiddenCount: hiddenCount)
                            }
                            .buttonStyle(.plain)
                            .invalidatableContent()
                        } else {
                            // iOS 16: 위젯 안 체크 불가 — 탭하면 widgetURL로 앱의 할 일 탭이 열림
                            // (링크로 상태를 바꾸면 외부 앱·웹이 같은 링크로 할 일을 조작할 수 있어 사용하지 않음)
                            todoRow(todo, hiddenCount: hiddenCount)
                        }
                    }
                }
            }

            Spacer(minLength: 0)
        }
    }

    private var header: some View {
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
    }

    private func todoRow(_ todo: TodoItem, hiddenCount: Int) -> some View {
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

            if hiddenCount > 0 {
                Text("+\(hiddenCount)")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 2)
        .contentShape(Rectangle())
    }
}

/// 노트리 캐릭터 — 홈 화면 색조(틴트) 모드에서는 단색 실루엣 대신 흑백으로 보이게
struct NoturiMarkImage: View {
    let name: String
    let size: CGFloat

    var body: some View {
        accented
            .scaledToFit()
            .frame(width: size, height: size)
    }

    /// widgetAccentedRenderingMode는 Image에만 붙고 View를 돌려줌 — resizable 바로 뒤에 적용
    @ViewBuilder
    private var accented: some View {
        let image = Image(name).resizable()
        if #available(iOS 18.0, *) {
            image.widgetAccentedRenderingMode(.desaturated)
        } else {
            image
        }
    }
}
