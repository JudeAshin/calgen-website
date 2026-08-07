'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Upload, X, AlertCircle } from 'lucide-react';
import { adsService } from '@/admin/services/ads-service';
import type { AdRole, CreateAdPayload } from '@/admin/types/ads';

interface CreateAdFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ROLES: { value: AdRole; label: string }[] = [
  { value: 'caller', label: 'Caller' },
  { value: 'host', label: 'Host' },
];

export function CreateAdForm({ onSuccess, onCancel }: CreateAdFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roles, setRoles] = useState<AdRole[]>([]);
  const [priority, setPriority] = useState(1);
  const [campaignType, setCampaignType] = useState('');
  const [campaignData, setCampaignData] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const toggleRole = (role: AdRole) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const validateJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (roles.length === 0) {
      setError('Select at least one target audience.');
      return;
    }
    if (!validateJson(campaignData)) {
      setError('Campaign data must be valid JSON.');
      return;
    }

    setLoading(true);
    try {
      const payload: CreateAdPayload = {
        title: title.trim(),
        description: description.trim(),
        image,
        redirect_url: redirectUrl.trim(),
        start_date: startDate,
        end_date: endDate,
        roles,
        priority,
        campaign_type: campaignType.trim(),
        // campaign_data: campaignData.trim() ? JSON.parse(campaignData) : null,
      };
      await adsService.createAd(payload);
      onSuccess();
    } catch (err) {
      setError(
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Failed to create advertisement.',
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60';
  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Basic Information</h3>
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Advertisement title"
            className={inputClass}
            disabled={loading}
          />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Advertisement description"
            rows={3}
            className={inputClass}
            disabled={loading}
          />
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Media</h3>
        <div>
          <label className={labelClass}>Image</label>
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 hover:border-emerald-500 hover:text-emerald-600">
              <Upload className="h-4 w-4" />
              {image ? 'Change image' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
            </label>
            {image && (
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" /> Remove
              </button>
            )}
          </div>
          {imagePreview && (
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Redirect & Schedule */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Redirect &amp; Schedule</h3>
        <div>
          <label className={labelClass}>Redirect URL</label>
          <input
            type="url"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="https://example.com/landing"
            className={inputClass}
            disabled={loading}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Start Date</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
          </div>
          <div>
            <label className={labelClass}>End Date</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Target Audience & Priority */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Target Audience &amp; Priority</h3>
        <div>
          <label className={labelClass}>Target Audience</label>
          <div className="flex gap-4">
            {ROLES.map((role) => (
              <label
                key={role.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={roles.includes(role.value)}
                  onChange={() => toggleRole(role.value)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  disabled={loading}
                />
                {role.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            min={1}
            className={`${inputClass} max-w-32`}
            disabled={loading}
          />
        </div>
      </div>

      {/* Campaign */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Campaign</h3>
        <div>
          <label className={labelClass}>Campaign Type</label>
          <input
            type="text"
            value={campaignType}
            onChange={(e) => setCampaignType(e.target.value)}
            placeholder="e.g. banner, popup, inline"
            className={inputClass}
            disabled={loading}
          />
        </div>
        <div>
          <label className={labelClass}>Campaign Data (JSON)</label>
          <textarea
            value={campaignData}
            onChange={(e) => setCampaignData(e.target.value)}
            placeholder='{"key": "value"}'
            rows={4}
            className={`${inputClass} font-mono text-xs`}
            disabled={loading}
          />
          {campaignData && !validateJson(campaignData) && (
            <p className="mt-1 text-xs text-red-500">Invalid JSON format</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating...
            </>
          ) : (
            'Create Advertisement'
          )}
        </button>
      </div>
    </form>
  );
}
