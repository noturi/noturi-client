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

    /// 직사각형: 남은 개수 + 다음 할 일 2개
    private var rectangular: some View {
        VStack(alignment: .leading, spacing: 2) {
            if entry.needsLogin {
                Text("Noturi").font(.headline)
                Text("앱을 열어 로그인해 주세요").font(.caption)
            } else {
                HStack(spacing: 4) {
                    Text("할 일").font(.headline)
                    Spacer(minLength: 0)
                    Text("\(entry.completedCount)/\(entry.totalCount)")
                        .font(.caption.weight(.semibold))
                }
                if pendingTodos.isEmpty {
                    Text(entry.totalCount == 0 ? "오늘 할 일이 없어요" : "모두 완료했어요 🎉")
                        .font(.caption)
                } else {
                    ForEach(pendingTodos.prefix(2)) { todo in
                        Label(todo.title, systemImage: "circle")
                            .font(.caption)
                            .lineLimit(1)
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .widgetURL(URL(string: "noturiclient://todo"))
    }
}
