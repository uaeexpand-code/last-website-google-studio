import { Expense, Category, TranslationKey } from '@/types';
// FIX: Imported `formatToYyyyMmDd` which was used without being imported.
import { formatToDdMmYyyy, getSmartDateDisplay, formatToYyyyMmDd } from './dateUtils';
import { formatCurrency } from './utils';

const colorMap: Record<string, number> = {
    Red: 0xFF0000,
    Green: 0x00FF00,
    Blue: 0x0000FF,
    Orange: 0xFFA500,
    Purple: 0x800080,
    Pink: 0xFFC0CB,
    Yellow: 0xFFFF00,
    Indigo: 0x4B0082,
    Teal: 0x008080,
    Cyan: 0x00FFFF,
};

export async function sendNewExpenseNotification(
  expense: Expense,
  category: Category,
  webhookUrl: string,
  currency: string,
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string
) {
  const smartDate = getSmartDateDisplay(expense.date, t);
  const daysDiff = new Date(expense.date).getTime() - new Date(formatToYyyyMmDd(new Date())).getTime();
  const isDueToday = daysDiff === 0;

  const embed = {
    title: `New Expense Added: ${category.name}`,
    description: expense.description || 'No description provided.',
    color: isDueToday ? colorMap.Red : colorMap.Blue,
    fields: [
      { name: 'Amount', value: `${formatCurrency(expense.amount)} ${currency}`, inline: true },
      { name: 'Category', value: category.name, inline: true },
      { name: 'Due Date', value: `${formatToDdMmYyyy(expense.date)} (${smartDate})`, inline: false },
    ],
    footer: {
      text: 'Expense Tracker',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] }),
    });
    if (!response.ok) {
      console.error('Failed to send Discord notification:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}

export async function sendTestNotification(webhookUrl: string, t: (key: TranslationKey) => string) {
    const embed = {
        title: "✅ Test Notification",
        description: "If you see this, your Discord webhook is configured correctly!",
        color: colorMap.Green,
        footer: { text: "Expense Tracker" },
        timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
    });

    return response.ok;
}