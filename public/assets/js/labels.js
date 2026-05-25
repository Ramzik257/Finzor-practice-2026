export const STATUS_LABELS = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  completed: 'Выполнена',
};

export const PRIORITY_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const ROLE_LABELS = {
  admin: 'Администратор',
  employee: 'Сотрудник',
};

export const USER_STATUS_LABELS = {
  active: 'Активен',
  blocked: 'Заблокирован',
};

export function labelStatus(value) {
  return STATUS_LABELS[value] ?? value;
}

export function labelPriority(value) {
  return PRIORITY_LABELS[value] ?? value;
}

export function labelRole(value) {
  return ROLE_LABELS[value] ?? value;
}
