#!/bin/bash
set -e

# Patch for expo-modules-core to support older iOS versions
SWIFT_FILE="node_modules/expo-modules-core/ios/Core/Views/SwiftUI/AutoSizingStack.swift"

if [ -f "$SWIFT_FILE" ]; then
  # Check if already patched
  if grep -q "fileprivate struct SizePreferenceKey: PreferenceKey" "$SWIFT_FILE"; then
    echo "✅ expo-modules-core already patched, skipping..."
  else
    # Use a temporary file to avoid issues with in-place editing
    TMP_FILE=$(mktemp)
    
    # Prepend the SizePreferenceKey struct definition to the file
    {
      echo "import SwiftUI"
      echo ""
      echo "fileprivate struct SizePreferenceKey: PreferenceKey {"
      echo "  static var defaultValue: CGSize = .zero"
      echo "  static func reduce(value: inout CGSize, nextValue: () -> CGSize) {}"
      echo "}"
      echo ""
      # Add the rest of the original file, skipping the original import
      tail -n +2 "$SWIFT_FILE"
    } > "$TMP_FILE"
    
    mv "$TMP_FILE" "$SWIFT_FILE"

  # Now, perform the replacement of the .onGeometryChange block
  awk '
    /\.onGeometryChange\(for: CGSize.self, of: { proxy in proxy.size }, action: { size in/ {
      print "            VStack {"
      print "              content"
      print "                .fixedSize()"
      print "                .hidden()"
      print "                .overlay("
      print "                  GeometryReader { proxy in"
      print "                    Color.clear.preference(key: SizePreferenceKey.self, value: proxy.size)"
      print "                  }"
      print "                )"
      print "            }"
      print "            .onPreferenceChange(SizePreferenceKey.self) { size in"
      print "              var size = size"
      print "              size.width = axis.contains(.horizontal) ? size.width : ShadowNodeProxy.UNDEFINED_SIZE"
      print "              size.height = axis.contains(.vertical) ? size.height : ShadowNodeProxy.UNDEFINED_SIZE"
      print "              proxy.setViewSize?(size)"
      print "            }"
      # Skip the next 5 lines of the original file
      for (i = 0; i < 5; i++) {
        getline
      }
      next
    }
    { print }
  ' "$SWIFT_FILE" > "$TMP_FILE"

  mv "$TMP_FILE" "$SWIFT_FILE"

    echo "✅ Patched expo-modules-core successfully."
  fi
else
  echo "⚠️ Could not find AutoSizingStack.swift to patch."
fi 