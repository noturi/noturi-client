import SwiftUI
import WidgetKit

struct NoturiTodoWidget: Widget {
    let kind: String = "NoturiTodoWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: TodoTimelineProvider()) { entry in
            NoturiWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Noturi 투두")
        .description("오늘의 할 일 목록과 완료율을 확인하세요.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct NoturiWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    let entry: TodoEntry

    var body: some View {
        switch family {
        case .systemSmall:
            TodoWidgetSmallView(entry: entry)
        case .systemMedium:
            TodoWidgetMediumView(entry: entry)
        default:
            TodoWidgetMediumView(entry: entry)
        }
    }
}

@main
struct NoturiWidgetBundle: WidgetBundle {
    var body: some Widget {
        NoturiTodoWidget()
    }
}
