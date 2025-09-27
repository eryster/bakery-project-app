import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormAttribute, ItemTypeSave } from '~/types';
import { Controller } from 'react-hook-form';
import { Header } from '~/components';
import { Colors, Spacing, Fonts } from '~/styles';
import { StackScreenProps } from '@react-navigation/stack';
import { useItemForm } from '~/hooks/useItemForm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RootStackParamList = {
  ItemForm: {
    title: string;
    attributes: FormAttribute[];
    itemSave: ItemTypeSave
  };
};

type ItemFormProps = StackScreenProps<RootStackParamList, 'ItemForm'>;

export function ItemForm({ navigation, route }: ItemFormProps) {
  const { title, attributes, itemSave } = route.params;
  const { control, handleSubmit, errors, isSaving, onSubmit, validationRules, onBackPress, isValid } = useItemForm(attributes, itemSave, navigation);
  const isDisabled = isSaving || !isValid;
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <Header title={title} onBackPress={onBackPress} />
      
      <View style={styles.contentWrapper}>
        <KeyboardAwareScrollView
          style={styles.keyboardAwareScrollView}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={0}
          enableAutomaticScroll={true}
        >
          {attributes.map(attr => (
            <Controller
              key={attr.name}
              control={control}
              name={attr.name}
              rules={validationRules(attr)}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{attr.label}:</Text>
                  <TextInput
                    style={[styles.input, error && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    keyboardType={attr.type === 'number' ? 'numeric' : 'default'}
                    placeholder={`Digite o ${attr.label.toLowerCase()}`}
                    placeholderTextColor={Colors.textLight}
                  />
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </View>
              )}
            />
          ))}
        </KeyboardAwareScrollView>

        <View style={[
            styles.buttonContainerFixed,
            { paddingBottom: insets.bottom === 0 ? Spacing.medium : insets.bottom }
        ]}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onBackPress}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, isDisabled && styles.disabledButton]}
              onPress={handleSubmit(onSubmit)}
              disabled={isDisabled}
            >
              {isSaving ? (
                <ActivityIndicator color={Colors.textOnPrimary} />
              ) : (
                <Text style={styles.buttonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentWrapper: { flex: 1 },
  keyboardAwareScrollView: { flex: 1 },
  formContent: {
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.large,
  },
  inputGroup: { width: '100%', marginBottom: Spacing.large },
  label: { fontSize: Fonts.regular, fontWeight: '600', color: Colors.text, marginBottom: Spacing.small },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: Spacing.small,
    padding: Spacing.medium,
    fontSize: Fonts.regular,
    color: Colors.text,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: { borderColor: Colors.error },
  errorText: { color: Colors.error, marginTop: Spacing.small / 2, fontSize: Fonts.small },
  buttonContainerFixed: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: Colors.accent,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderRadius: Spacing.small,
    flex: 1,
    marginHorizontal: Spacing.small,
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButton: { backgroundColor: Colors.primary },
  cancelButton: { backgroundColor: Colors.error },
  buttonText: { color: Colors.textOnPrimary, fontWeight: 'bold', fontSize: Fonts.regular },
  disabledButton: { opacity: 0.7 },
});