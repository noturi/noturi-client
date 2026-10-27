import ExpoModulesCore
import WidgetKit

public class WidgetBridgeModule: Module {
    public func definition() -> ModuleDefinition {
        Name("WidgetBridge")

        AsyncFunction("syncWidgetData") { (jsonString: String) in
            let defaults = UserDefaults(suiteName: "group.com.noturi.app")
            if defaults == nil {
                NSLog("[WidgetBridge] ERROR: UserDefaults suiteName is nil - App Group not configured")
            }
            defaults?.set(jsonString, forKey: "widgetTodoData")
            defaults?.synchronize()

            // Verify write
            let saved = defaults?.string(forKey: "widgetTodoData")
            NSLog("[WidgetBridge] Data saved: \(saved != nil), length: \(saved?.count ?? 0)")

            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
                NSLog("[WidgetBridge] reloadAllTimelines called")
            }
        }

        // 위젯 전용 세션 토큰을 공유 키체인에 저장 (앱 토큰과 별개 세션)
        AsyncFunction("syncAuthTokens") { (accessToken: String, refreshToken: String, baseUrl: String) in
            SharedKeychain.set("accessToken", accessToken)
            SharedKeychain.set("refreshToken", refreshToken)

            let defaults = UserDefaults(suiteName: "group.com.noturi.app")
            defaults?.set(baseUrl, forKey: "baseUrl")
            // 이전 버전이 App Group UserDefaults(평문)에 저장하던 토큰 제거
            defaults?.removeObject(forKey: "accessToken")
            defaults?.removeObject(forKey: "refreshToken")

            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
        }

        // 로그아웃 시 위젯 토큰 삭제
        AsyncFunction("clearAuthTokens") { () in
            SharedKeychain.delete("accessToken")
            SharedKeychain.delete("refreshToken")

            let defaults = UserDefaults(suiteName: "group.com.noturi.app")
            defaults?.removeObject(forKey: "accessToken")
            defaults?.removeObject(forKey: "refreshToken")
            defaults?.removeObject(forKey: "widgetTodoData")

            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
        }

        AsyncFunction("reloadWidget") { () in
            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
        }

        AsyncFunction("readWidgetData") { () -> String in
            let defaults = UserDefaults(suiteName: "group.com.noturi.app")
            if defaults == nil {
                return "ERROR: UserDefaults(suiteName: group.com.noturi.app) is nil - App Group not configured"
            }
            let data = defaults!.string(forKey: "widgetTodoData")
            if data == nil {
                // Try standard UserDefaults as comparison
                let stdData = UserDefaults.standard.string(forKey: "widgetTodoData")
                return "ERROR: key 'widgetTodoData' not found in App Group defaults. Standard defaults has it: \(stdData != nil)"
            }
            return "OK: \(data!.count) chars"
        }
    }
}
