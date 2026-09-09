import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function AddReminderModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    setLoading(true);
    await onAdd({ title, date, note });
    setLoading(false);
    setTitle('');
    setDate('');
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Reminder">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g., Submit Assignment"
        />
        <Input
          label="Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5">Note (Optional)</label>
          <textarea
            className="w-full px-3.5 py-2.5 rounded-theme-md border border-border bg-surface text-on-surface placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add some details..."
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={!title.trim() || !date}>
            Save Reminder
          </Button>
        </div>
      </form>
    </Modal>
  );
}
