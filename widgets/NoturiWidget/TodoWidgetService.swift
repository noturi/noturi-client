import Foundation

struct TodoListResponse: Codable {
    let date: String?
    let year: Int
    let month: Int
    let data: [TodoApiItem]
    let rate: Double
}

struct TodoApiItem: Codable {
    let id: String
    let title: String
    let description: String?
    let date: String
    let isCompleted: Bool
    let completedAt: String?
    let templateId: String?
    let carryOverCount: Int
    let createdAt: String
    let updatedAt: String
}

struct TodoToggleResponse: Codable {
    let id: String
    let title: String
    let isCompleted: Bool
    let dailyStats: DailyStats
}

struct DailyStats: Codable {
    let total: Int
    let completed: Int
    let rate: Double
}

struct RefreshTokenResponse: Codable {
    let accessToken: String
    let refreshToken: String
}

class TodoWidgetService {
    static func fetchTodos(for date: String) async -> WidgetTodoData? {
        guard let baseUrl = SharedDataManager.getBaseUrl(),
              let accessToken = SharedDataManager.getAccessToken() else {
            return nil
        }

        let urlString = "\(baseUrl)/client/todos?date=\(date)"
        guard let url = URL(string: urlString) else { return nil }

        var request = URLRequest(url: url)
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 10

        do {
            let (data, response) = try await URLSession.shared.data(for: request)

            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 401 {
                // Try refresh token
                if let newToken = await refreshAccessToken() {
                    return await fetchTodosWithToken(date: date, baseUrl: baseUrl, token: newToken)
                }
                return nil
            }

            let todoResponse = try JSONDecoder().decode(TodoListResponse.self, from: data)
            let widgetData = WidgetTodoData(
                todos: todoResponse.data.map { TodoItem(id: $0.id, title: $0.title, isCompleted: $0.isCompleted) },
                date: date,
                rate: todoResponse.rate,
                total: todoResponse.data.count,
                completed: todoResponse.data.filter { $0.isCompleted }.count,
                lastUpdated: ISO8601DateFormatter().string(from: Date())
            )

            SharedDataManager.saveTodoData(widgetData)
            return widgetData
        } catch {
            return nil
        }
    }

    static func toggleTodo(id: String) async -> Bool {
        guard let baseUrl = SharedDataManager.getBaseUrl(),
              let accessToken = SharedDataManager.getAccessToken() else {
            return false
        }

        let urlString = "\(baseUrl)/client/todos/\(id)/toggle"
        guard let url = URL(string: urlString) else { return false }

        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 10

        do {
            let (data, response) = try await URLSession.shared.data(for: request)

            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 401 {
                if let newToken = await refreshAccessToken() {
                    return await toggleTodoWithToken(id: id, baseUrl: baseUrl, token: newToken)
                }
                return false
            }

            let _ = try JSONDecoder().decode(TodoToggleResponse.self, from: data)
            return true
        } catch {
            return false
        }
    }

    private static func refreshAccessToken() async -> String? {
        guard let baseUrl = SharedDataManager.getBaseUrl(),
              let refreshToken = SharedDataManager.getRefreshToken() else {
            return nil
        }

        let urlString = "\(baseUrl)/client/auth/refresh"
        guard let url = URL(string: urlString) else { return nil }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONEncoder().encode(["refreshToken": refreshToken])
        request.timeoutInterval = 10

        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            let tokenResponse = try JSONDecoder().decode(RefreshTokenResponse.self, from: data)
            SharedDataManager.saveTokens(
                accessToken: tokenResponse.accessToken,
                refreshToken: tokenResponse.refreshToken
            )
            return tokenResponse.accessToken
        } catch {
            return nil
        }
    }

    private static func fetchTodosWithToken(date: String, baseUrl: String, token: String) async -> WidgetTodoData? {
        let urlString = "\(baseUrl)/client/todos?date=\(date)"
        guard let url = URL(string: urlString) else { return nil }

        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 10

        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            let todoResponse = try JSONDecoder().decode(TodoListResponse.self, from: data)
            let widgetData = WidgetTodoData(
                todos: todoResponse.data.map { TodoItem(id: $0.id, title: $0.title, isCompleted: $0.isCompleted) },
                date: date,
                rate: todoResponse.rate,
                total: todoResponse.data.count,
                completed: todoResponse.data.filter { $0.isCompleted }.count,
                lastUpdated: ISO8601DateFormatter().string(from: Date())
            )
            SharedDataManager.saveTodoData(widgetData)
            return widgetData
        } catch {
            return nil
        }
    }

    private static func toggleTodoWithToken(id: String, baseUrl: String, token: String) async -> Bool {
        let urlString = "\(baseUrl)/client/todos/\(id)/toggle"
        guard let url = URL(string: urlString) else { return false }

        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 10

        do {
            let (_, _) = try await URLSession.shared.data(for: request)
            return true
        } catch {
            return false
        }
    }
}
