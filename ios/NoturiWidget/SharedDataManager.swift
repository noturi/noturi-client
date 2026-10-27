import Foundation

struct SharedDataManager {
    private static let suiteName = "group.com.noturi.app"

    static func getTodoData() -> WidgetTodoData? {
        guard let defaults = UserDefaults(suiteName: suiteName),
              let jsonString = defaults.string(forKey: "widgetTodoData"),
              let data = jsonString.data(using: .utf8) else {
            return nil
        }

        return try? JSONDecoder().decode(WidgetTodoData.self, from: data)
    }

    // 토큰은 공유 키체인(위젯 전용 세션)에서 읽음 — App Group UserDefaults에는 저장하지 않음
    static func getAccessToken() -> String? {
        SharedKeychain.get("accessToken")
    }

    static func getRefreshToken() -> String? {
        SharedKeychain.get("refreshToken")
    }

    static func getBaseUrl() -> String? {
        let defaults = UserDefaults(suiteName: suiteName)
        return defaults?.string(forKey: "baseUrl")
    }

    static func saveTodoData(_ data: WidgetTodoData) {
        guard let defaults = UserDefaults(suiteName: suiteName),
              let jsonData = try? JSONEncoder().encode(data),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            return
        }
        defaults.set(jsonString, forKey: "widgetTodoData")
        defaults.synchronize()
    }

    static func saveTokens(accessToken: String, refreshToken: String) {
        SharedKeychain.set("accessToken", accessToken)
        SharedKeychain.set("refreshToken", refreshToken)
    }
}
