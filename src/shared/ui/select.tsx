import { ChevronDown } from 'lucide-react-native';

import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  View as RNView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Typography } from './typography';

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
      triggerRef.current.measureInWindow((x: number, y: number, _width: number, height: number) => {
        const screenHeight = Dimensions.get('window').height;
        const dropdownHeight = Math.min(options.length * 40, 200);
        const spaceBelow = screenHeight - (y + height);
        const spaceAbove = y;

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
    <View style={[styles.container, { width: width as any }]}>
      {/* Trigger */}
      <RNView ref={triggerRef} collapsable={false}>
        <TouchableOpacity activeOpacity={1} disabled={disabled} onPress={toggleOpen}>
          <View
            className={`flex-row items-center justify-between rounded-5 border bg-surface px-3 ${
              isOpen ? 'border-border-active' : 'border-border'
            }`}
            style={[{ height }, disabled && styles.disabled]}
          >
            <View className="flex-1">
              <Typography
                className={selectedOption ? 'text-text-primary' : 'text-text-muted'}
                variant="body"
              >
                {displayText}
              </Typography>
            </View>
            <ChevronDown
              color="#9e9e9e"
              size={16}
              style={isOpen ? { transform: [{ rotate: '180deg' }] } : undefined}
            />
          </View>
        </TouchableOpacity>
      </RNView>

      {/* Dropdown */}
      {isOpen && (
        <View
          className="absolute left-0 right-0 overflow-hidden rounded-4 border border-border bg-bg-primary"
          style={[
            styles.dropdown,
            dropdownPosition === 'top'
              ? { bottom: '100%', marginBottom: 4 }
              : { top: '100%', marginTop: 4 },
          ]}
        >
          <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                className={`min-h-[40px] flex-row items-center px-3 py-2 ${
                  option.value === value ? 'bg-bg-secondary' : ''
                }`}
                onPress={() => handleSelect(option.value)}
              >
                <Typography className="text-text-primary" variant="body">
                  {option.label}
                </Typography>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 배경 터치 시 닫기 */}
      {isOpen && <TouchableOpacity style={styles.backdrop} onPress={() => setIsOpen(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  dropdown: {
    zIndex: 999999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 999998,
  },
});
