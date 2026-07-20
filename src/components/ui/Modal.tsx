import { Modal as RNModal, Pressable, View, ViewStyle } from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}

export function Modal({ visible, onClose, children, contentContainerStyle }: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onClose}
      >
        <View style={contentContainerStyle}>
          {/* A no-op Pressable around the actual card so taps on empty
              card space don't fall through and close the menu. */}
          <Pressable onPress={() => {}}>{children}</Pressable>
        </View>
      </Pressable>
    </RNModal>
  );
}