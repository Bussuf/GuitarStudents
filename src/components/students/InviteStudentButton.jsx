import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UserPlus, Mail, Check, X } from 'lucide-react';
import NeonButton from '../ui/NeonButton';
import FormInput from '../ui/FormInput';
import FullScreenModal from '../ui/FullScreenModal';

export default function InviteStudentButton() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const inviteMutation = useMutation({
    mutationFn: async (email) => {
      return base44.users.inviteUser(email, 'user');
    },
    onSuccess: () => {
      setSuccess(true);
      setError('');
      setTimeout(() => {
        setShowModal(false);
        setEmail('');
        setSuccess(false);
      }, 2000);
    },
    onError: (err) => {
      setError(err.message || 'שגיאה בשליחת ההזמנה');
      setSuccess(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    inviteMutation.mutate(email);
  };

  return (
    <>
      <NeonButton onClick={() => setShowModal(true)} size="sm">
        <UserPlus size={18} />
        הזמן תלמיד
      </NeonButton>

      {showModal && (
        <FullScreenModal
          title="הזמן תלמיד למערכת"
          onClose={() => {
            setShowModal(false);
            setEmail('');
            setSuccess(false);
            setError('');
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4">
              <p className="text-slate-300 text-sm mb-2">
                <Mail className="w-4 h-4 inline ml-1" />
                התלמיד יקבל מייל עם קישור להרשמה
              </p>
              <p className="text-slate-400 text-xs">
                לאחר ההרשמה, התלמיד יוכל לראות את השיעורים שלו וחומרי לימוד
              </p>
            </div>

            <FormInput
              label="כתובת מייל של התלמיד"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                <X className="w-5 h-5 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400" />
                <p className="text-emerald-400 text-sm">ההזמנה נשלחה בהצלחה!</p>
              </div>
            )}

            <div className="flex gap-3">
              <NeonButton
                type="submit"
                disabled={inviteMutation.isPending || success}
                className="flex-1"
              >
                {inviteMutation.isPending ? 'שולח...' : 'שלח הזמנה'}
              </NeonButton>
              <NeonButton
                type="button"
                variant="ghost"
                onClick={() => setShowModal(false)}
              >
                ביטול
              </NeonButton>
            </div>
          </form>
        </FullScreenModal>
      )}
    </>
  );
}