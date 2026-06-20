// ============================================
// UNSAVED CHANGES DIALOG - Dialog de confirmação de mudanças não salvas
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  title,
  description,
}) => {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t('components.unsavedChangesDialog.title');
  const resolvedDescription = description ?? t('components.unsavedChangesDialog.description');
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <AlertDialogTitle>{resolvedTitle}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="pt-2">
            {resolvedDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {t('components.unsavedChangesDialog.keepEditing')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {t('components.unsavedChangesDialog.leaveWithoutSaving')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
