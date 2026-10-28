import SwiftUI
import WidgetKit

/// 잠금화면 위젯 — 시스템이 단색으로 렌더링하므로 색 대신 모양·굵기로 구분
struct TodoWidgetAccessoryView: View {
    @Environment(\.widgetFamily) var family
    let entry: TodoEntry

    private var remainingCount: Int { entry.totalCount - entry.completedCount }

    private var progressValue: Double {
        entry.totalCount > 0 ? Double(entry.completedCount) / Double(entry.totalCount) : 0
    }

    /// 아직 완료하지 않은 할 일 (앞에서부터)
    private var pendingTodos: [TodoItem] {
        entry.todos.filter { !$0.isCompleted }
    }

    var body: some View {
        if #available(iOS 17.0, *) {
            content
                .containerBackground(for: .widget) { Color.clear }
        } else {
            content
        }
    }

    @ViewBuilder
    private var content: some View {
        switch family {
        case .accessoryCircular:
            circular
        case .accessoryInline:
            inline
        default:
            rectangular
        }
    }

    /// 원형: 완료율 게이지
    private var circular: some View {
        Gauge(value: progressValue) {
            Image(systemName: "checkmark")
        } currentValueLabel: {
            Text("\(entry.completedCount)/\(entry.totalCount)")
        }
        .gaugeStyle(.accessoryCircularCapacity)
        .widgetURL(URL(string: "noturiclient://todo"))
    }

    /// 한 줄: 시계 위 텍스트
    private var inline: some View {
        Group {
            if entry.needsLogin {
                Text("Noturi 로그인 필요")
            } else if entry.totalCount == 0 {
                Text("오늘 할 일 없음")
            } else if remainingCount == 0 {
                Label("할 일 모두 완료", systemImage: "checkmark.circle")
            } else {
                Label("할 일 \(remainingCount)개 남음", systemImage: "circle")
            }
        }
        .widgetURL(URL(string: "noturiclient://todo"))
    }

    /// 직사각형: 다음 할 일 3개 (더 있으면 +N) — 할 일 행은 탭하면 완료, 나머지 영역은 앱 열기
    private var rectangular: some View {
        VStack(alignment: .leading, spacing: 3) {
            if entry.needsLogin {
                Text("Noturi").font(.headline)
                Text("앱을 열어 로그인해 주세요").font(.caption)
            } else {
                if pendingTodos.isEmpty {
                    // 잠금화면은 단색으로 렌더링 — 흰 몸·검은 눈이라 실루엣이 그대로 살아남
                    HStack(spacing: 8) {
                        Image("NoturiMark")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 36, height: 36)
                        Text(entry.totalCount == 0 ? "오늘 할 일이 없어요" : "모두 완료했어요")
                            .font(.footnote.weight(.semibold))
                    }
                    .frame(maxHeight: .infinity)
                } else {
                    // 높이가 3줄뿐이라 3개만 표시 — 나머지는 마지막 줄 끝에 개수로
                    let shown = Array(pendingTodos.prefix(3))
                    let hiddenCount = pendingTodos.count - shown.count
                    ForEach(shown) { todo in
                        let row = HStack(spacing: 4) {
                            Label(todo.title, systemImage: "circle")
                                .lineLimit(1)
                            Spacer(minLength: 0)
                            if hiddenCount > 0, todo.id == shown.last?.id {
                                Text("+\(hiddenCount)")
                                    .fontWeight(.semibold)
                                    .layoutPriority(1)
                            }
                        }
                        .font(.footnote)
                        .contentShape(Rectangle())

                        if #available(iOS 17.0, *) {
                            // 행을 탭하면 잠금화면에서 바로 완료 — 완료된 할 일은 목록에서 빠짐
                            Button(intent: ToggleTodoIntent(todoId: todo.id)) { row }
                                .buttonStyle(.plain)
                                .invalidatableContent()
                        } else {
                            row
                        }
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .widgetURL(URL(string: "noturiclient://todo"))
    }
}
