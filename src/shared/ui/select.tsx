import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { ChevronDown } from '@tamagui/lucide-icons';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  width?: string | number;
  disabled?: boolean;
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = '선택하세요',
  height = 44,
  width = '100%',
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <YStack position="relative" width={width}>
      {/* Trigger */}
      <TouchableOpacity disabled={disabled} onPress={toggleOpen}>
        <XStack
          alignItems="center"
          backgroundColor="$surface"
          borderColor="$border"
          borderRadius="$4"
          borderWidth={1}
          height={height}
          justifyContent="space-between"
          opacity={disabled ? 0.5 : 1}
          paddingHorizontal="$3"
          width="100%"
        >
          <View flex={1}>
            <Text color={selectedOption ? '$textPrimary' : '$textMuted'} fontSize="$4">
              {displayText}
            </Text>
          </View>
          <ChevronDown
            color="$textMuted"
            size="$1"
            transform={isOpen ? [{ rotate: '180deg' }] : undefined}
          />
        </XStack>
      </TouchableOpacity>

      {/* Dropdown */}
      {isOpen && (
        <YStack
          backgroundColor="$backgroundPrimary"
          borderColor="$borderColor"
          borderRadius="$4"
          borderWidth={1}
          elevation={5}
          left={0}
          marginTop="$1"
          maxHeight={200}
          position="absolute"
          right={0}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          top="100%"
          zIndex={999999}
        >
          <ScrollView maxHeight={200}>
            {options.map((option) => (
              <TouchableOpacity key={option.value} onPress={() => handleSelect(option.value)}>
                <XStack
                  alignItems="center"
                  backgroundColor={option.value === value ? '$backgroundSecondary' : 'transparent'}
                  hoverStyle={{
                    backgroundColor: '$backgroundSecondary',
                  }}
                  minHeight={40}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  <Text color="$textPrimary" fontSize="$4">
                    {option.label}
                  </Text>
                </XStack>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </YStack>
      )}

      {/* 배경 터치 시 닫기 */}
      {isOpen && (
        <TouchableOpacity
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999998,
          }}
          onPress={() => setIsOpen(false)}
        />
      )}
    </YStack>
  );
}
