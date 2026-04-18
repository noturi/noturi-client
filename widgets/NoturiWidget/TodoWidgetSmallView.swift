import SwiftUI
import WidgetKit

struct TodoWidgetSmallView: View {
    let entry: TodoEntry

    private var displayDate: String {
        guard !entry.isPlaceholder else { return "3월 28일" }
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: entry.dateString) else { return entry.dateString }
        formatter.dateFormat = "M월 d일"
        return formatter.string(from: date)
    }

    private var progressValue: Double {
        entry.totalCount > 0 ? Double(entry.completedCount) / Double(entry.totalCount) : 0
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
        VStack(spacing: 8) {
            HStack {
                Text("Noturi")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.primary)
                Spacer()
            }

            Spacer()

            ZStack {
                Circle()
                    .stroke(Color.gray.opacity(0.2), lineWidth: 6)
                    .frame(width: 56, height: 56)

                Circle()
                    .trim(from: 0, to: progressValue)
                    .stroke(Color.blue, style: StrokeStyle(lineWidth: 6, lineCap: .round))
                    .frame(width: 56, height: 56)
                    .rotationEffect(.degrees(-90))

                Text("\(Int(entry.rate))%")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.primary)
            }

            VStack(spacing: 2) {
                Text("\(entry.completedCount)/\(entry.totalCount) 완료")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.secondary)

                Text(displayDate)
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
            }
        }
        .widgetURL(URL(string: "noturiclient://todo"))
    }
}
