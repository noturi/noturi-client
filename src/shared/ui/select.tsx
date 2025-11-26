import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import React, { useRef, useState } from 'react';
import { Dimensions, View as RNView, TouchableOpacity } from 'react-native';

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
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const triggerRef = useRef<RNView>(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  const calculatePosition = () => {
    if (triggerRef.current) {
      triggerRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        const screenHeight = Dimensions.get('window').height;
        const dropdownHeight = Math.min(options.length * 40, 200);
        const spaceBelow = screenHeight - (y + height);
        const spaceAbove = y;

        // 아래 공간이 충분하지 않고 위 공간이 더 크면 위로 표시
        if (spaceBelow < dropdownHeight + 20 && spaceAbove > spaceBelow) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      });
    }
  };

  const toggleOpen = () => {
    if (!disabled) {
      if (!isOpen) {
        calculatePosition();
      }
      setIsOpen(!isOpen);
    }
  };

  return (
    <YStack position="relative" width={width}>
      {/* Trigger */}
      <RNView ref={triggerRef} collapsable={false}>
        <TouchableOpacity activeOpacity={1} disabled={disabled} onPress={toggleOpen}>
          <XStack
            alignItems="center"
            backgroundColor="$surface"
            borderColor={isOpen ? '$borderActive' : '$border'}
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
      </RNView>

      {/* Dropdown */}
      {isOpen && (
        <YStack
          backgroundColor="$backgroundPrimary"
          borderColor="$border"
          borderRadius="$4"
          borderWidth={1}
          bottom={dropdownPosition === 'top' ? '100%' : undefined}
          elevation={5}
          left={0}
          marginBottom={dropdownPosition === 'top' ? '$1' : undefined}
          marginTop={dropdownPosition === 'bottom' ? '$1' : undefined}
          maxHeight={200}
          overflow="hidden"
          position="absolute"
          right={0}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          top={dropdownPosition === 'bottom' ? '100%' : undefined}
          zIndex={999999}
        >
          <ScrollView maxHeight={200} showsVerticalScrollIndicator={false}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.7}
                onPress={() => handleSelect(option.value)}
              >
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
