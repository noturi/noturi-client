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

    static func getAccessToken() -> String? {
        let defaults = UserDefaults(suiteName: suiteName)
        return defaults?.string(forKey: "accessToken")
    }

    static func getRefreshToken() -> String? {
        let defaults = UserDefaults(suiteName: suiteName)
        return defaults?.string(forKey: "refreshToken")
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
        guard let defaults = UserDefaults(suiteName: suiteName) else { return }
        defaults.set(accessToken, forKey: "accessToken")
        defaults.set(refreshToken, forKey: "refreshToken")
        defaults.synchronize()
    }
}
