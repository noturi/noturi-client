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

        AsyncFunction("syncAuthTokens") { (accessToken: String, refreshToken: String, baseUrl: String) in
            let defaults = UserDefaults(suiteName: "group.com.noturi.app")
            defaults?.set(accessToken, forKey: "accessToken")
            defaults?.set(refreshToken, forKey: "refreshToken")
            defaults?.set(baseUrl, forKey: "baseUrl")
            defaults?.synchronize()
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
