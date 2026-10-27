import ExpoModulesCore
import WidgetKit

public class WidgetBridgeModule: Module {
    public func definition() -> ModuleDefinition {
        Name("WidgetBridge")

        AsyncFunction("syncWidgetData") { (jsonString: String) in
            UserDefaults(suiteName: "group.com.noturi.app")?.set(jsonString, forKey: "widgetTodoData")
            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
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
    }
}
