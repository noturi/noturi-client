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

/// 서버 응답: { "tokens": { "accessToken", "refreshToken" } }
struct RefreshTokenResponse: Codable {
    struct Tokens: Codable {
        let accessToken: String
        let refreshToken: String
    }
    let tokens: Tokens
}

/// 위젯의 할 일 조회 결과 — 인증 실패는 "로그인 필요"로 화면에 표시하기 위해 구분
enum TodoFetchResult {
    case success(WidgetTodoData)
    case unauthorized
    case failure
}

/// 인증이 필요한 요청 결과
private enum ApiResponse {
    case ok(Data)
    case unauthorized
    case failure
}

enum TodoWidgetService {
    static func fetchTodos(for date: String) async -> TodoFetchResult {
        switch await send(path: "client/todos?date=\(date)", method: "GET") {
        case .ok(let data):
            guard let todoResponse = try? JSONDecoder().decode(TodoListResponse.self, from: data) else {
                return .failure
            }
            let widgetData = WidgetTodoData(
                todos: todoResponse.data.map { TodoItem(id: $0.id, title: $0.title, isCompleted: $0.isCompleted) },
                date: date,
                rate: todoResponse.rate,
                total: todoResponse.data.count,
                completed: todoResponse.data.filter { $0.isCompleted }.count,
                lastUpdated: ISO8601DateFormatter().string(from: Date())
            )
            SharedDataManager.saveTodoData(widgetData)
            return .success(widgetData)
        case .unauthorized:
            return .unauthorized
        case .failure:
            return .failure
        }
    }

    static func toggleTodo(id: String) async -> Bool {
        if case .ok = await send(path: "client/todos/\(id)/toggle", method: "PATCH") {
            return true
        }
        return false
    }

    /// 액세스 토큰으로 요청, 401이면 토큰을 한 번 갱신해 재시도. 2xx만 성공으로 처리
    private static func send(path: String, method: String) async -> ApiResponse {
        guard let baseUrl = SharedDataManager.getBaseUrl(),
              let url = URL(string: "\(baseUrl)/\(path)") else {
            return .failure
        }
        guard let accessToken = SharedDataManager.getAccessToken() else {
            return .unauthorized
        }

        let first = await perform(url: url, method: method, token: accessToken)
        guard first.status == 401 else {
            return first.result
        }

        guard let newToken = await refreshAccessToken() else {
            return .unauthorized
        }
        let retry = await perform(url: url, method: method, token: newToken)
        return retry.status == 401 ? .unauthorized : retry.result
    }

    private static func perform(url: URL, method: String, token: String) async -> (status: Int, result: ApiResponse) {
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        // 서버가 사용자별 "오늘"(자정 이월 등)을 계산하는 기준
        request.setValue(TimeZone.current.identifier, forHTTPHeaderField: "X-Timezone")
        request.timeoutInterval = 10

        guard let (data, response) = try? await URLSession.shared.data(for: request),
              let http = response as? HTTPURLResponse else {
            return (0, .failure)
        }
        return (http.statusCode, (200..<300).contains(http.statusCode) ? .ok(data) : .failure)
    }

    private static func refreshAccessToken() async -> String? {
        guard let baseUrl = SharedDataManager.getBaseUrl(),
              let refreshToken = SharedDataManager.getRefreshToken(),
              let url = URL(string: "\(baseUrl)/client/auth/refresh") else {
            return nil
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONEncoder().encode(["refreshToken": refreshToken])
        request.timeoutInterval = 10

        guard let (data, response) = try? await URLSession.shared.data(for: request),
              let http = response as? HTTPURLResponse, http.statusCode == 200,
              let tokens = try? JSONDecoder().decode(RefreshTokenResponse.self, from: data).tokens else {
            return nil
        }
        // 리프레시 토큰은 1회용(RTR) — 새 토큰을 반드시 저장해야 다음 갱신이 가능
        SharedDataManager.saveTokens(accessToken: tokens.accessToken, refreshToken: tokens.refreshToken)
        return tokens.accessToken
    }
}
