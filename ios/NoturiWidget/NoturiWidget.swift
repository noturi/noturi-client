import SwiftUI
import WidgetKit

struct NoturiTodoWidget: Widget {
    let kind: String = "NoturiTodoWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: TodoTimelineProvider()) { entry in
            NoturiWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Noturi 투두")
        .description("오늘의 할 일을 확인하고 바로 체크하세요.")
        .supportedFamilies([
            .systemSmall, .systemMedium, .systemLarge,
            .accessoryCircular, .accessoryRectangular, .accessoryInline,
        ])
    }
}

struct NoturiWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    let entry: TodoEntry

    var body: some View {
        switch family {
        case .accessoryCircular, .accessoryRectangular, .accessoryInline:
            // 잠금화면은 공간이 작아 로그인 안내도 자체 처리
            TodoWidgetAccessoryView(entry: entry)
        default:
            if entry.needsLogin {
                SignedOutView()
            } else {
                switch family {
                case .systemSmall:
                    TodoWidgetSmallView(entry: entry)
                case .systemLarge:
                    TodoWidgetListView(entry: entry, maxCount: 10)
                default:
                    TodoWidgetListView(entry: entry, maxCount: 4)
                }
            }
        }
    }
}

/// 위젯 세션이 없거나 만료 — 탭하면 앱이 열리고, 앱이 로그인 상태면 새 위젯 세션을 발급
struct SignedOutView: View {
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
        VStack(spacing: 6) {
            Text("Noturi")
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.primary)
            Spacer(minLength: 0)
            Image(systemName: "person.crop.circle.badge.exclamationmark")
                .font(.system(size: 22))
                .foregroundColor(.secondary)
            Text("앱을 열어 로그인해 주세요")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity)
        .widgetURL(URL(string: "noturiclient://todo"))
    }
}

@main
struct NoturiWidgetBundle: WidgetBundle {
    var body: some Widget {
        NoturiTodoWidget()
    }
}
