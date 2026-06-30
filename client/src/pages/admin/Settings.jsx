import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const API_BASE = '/api';

const emptySettings = {
  siteName: '',
  logo: { primaryText: '', accentText: '', imageUrl: '' },
  whatsappNumber: '',
  contact: { phone: '', email: '', address: '', workingHours: '' },
  social: { instagram: '', facebook: '', linkedin: '', youtube: '' },
  hero: {
    headlineLine1: '',
    headlineLine2: '',
    subtitle: '',
    backgroundImage: '',
  },
  about: {
    storyHeading: '',
    storyParagraph: '',
    legacyHeading: '',
    legacyParagraphs: [''],
  },
  stats: {
    yearsExperience: 0,
    propertiesSold: 0,
    happyClients: 0,
    investmentPortfolioCr: 0,
  },
  footer: { description: '' },
};

// Immutable nested-path update, e.g. updateField('contact.phone', value)
function setNestedField(obj, path, value) {
  const keys = path.split('.');
  const result = { ...obj };
  let cursor = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    cursor[key] = { ...cursor[key] };
    cursor = cursor[key];
  }

  cursor[keys[keys.length - 1]] = value;
  return result;
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const cardClass = 'bg-white rounded-xl border border-gray-200 p-6';

export default function Settings() {
  const { token } = useAuth();
  const [form, setForm] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success' | 'error', message }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => mergeSettings(prev, data));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(timer);
  }, [banner]);

  const updateField = (path, value) => {
    setForm((prev) => setNestedField(prev, path, value));
  };

  const updateLegacyParagraph = (index, value) => {
    setForm((prev) => {
      const legacyParagraphs = [...prev.about.legacyParagraphs];
      legacyParagraphs[index] = value;
      return {
        ...prev,
        about: { ...prev.about, legacyParagraphs },
      };
    });
  };

  const addLegacyParagraph = () => {
    setForm((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        legacyParagraphs: [...prev.about.legacyParagraphs, ''],
      },
    }));
  };

  const removeLegacyParagraph = (index) => {
    setForm((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        legacyParagraphs: prev.about.legacyParagraphs.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleHeroImageUpload = async (file) => {
    if (!file) return;
    setUploadingHero(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/settings/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        updateField('hero.backgroundImage', data.url);
      } else {
        setBanner({ type: 'error', message: 'Failed to upload image' });
      }
    } catch {
      setBanner({ type: 'error', message: 'Failed to upload image' });
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => mergeSettings(prev, data));
        setBanner({ type: 'success', message: 'Settings saved successfully' });
      } else {
        const errData = await res.json().catch(() => ({}));
        setBanner({
          type: 'error',
          message: errData.message || 'Failed to save settings',
        });
      }
    } catch {
      setBanner({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header / Save bar */}
      <div className="sticky top-0 z-20 -mx-4 lg:-mx-6 px-4 lg:px-6 py-4 bg-gray-50/95 backdrop-blur border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage site-wide content shown on the public website
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition shrink-0"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Banner */}
      {banner && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium ${
            banner.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {banner.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {banner.message}
        </div>
      )}

      {/* General */}
      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Site Name</label>
            <input
              type="text"
              value={form.siteName}
              onChange={(e) => updateField('siteName', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp Number</label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => updateField('whatsappNumber', e.target.value)}
              placeholder="919876543210"
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">
              Digits only, with country code, e.g. 919876543210
            </p>
          </div>
          <div>
            <label className={labelClass}>Logo Primary Text</label>
            <input
              type="text"
              value={form.logo.primaryText}
              onChange={(e) =>
                updateField('logo.primaryText', e.target.value)
              }
              placeholder="AVIKESH"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Logo Accent Text</label>
            <input
              type="text"
              value={form.logo.accentText}
              onChange={(e) => updateField('logo.accentText', e.target.value)}
              placeholder="REALTY"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hero Section
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Headline Line 1</label>
            <input
              type="text"
              value={form.hero.headlineLine1}
              onChange={(e) =>
                updateField('hero.headlineLine1', e.target.value)
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Headline Line 2</label>
            <input
              type="text"
              value={form.hero.headlineLine2}
              onChange={(e) =>
                updateField('hero.headlineLine2', e.target.value)
              }
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Subtitle</label>
            <textarea
              value={form.hero.subtitle}
              onChange={(e) => updateField('hero.subtitle', e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Background Image</label>
            <div className="flex items-start gap-4">
              <div className="w-32 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                {uploadingHero ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : form.hero.backgroundImage ? (
                  <img
                    src={form.hero.backgroundImage}
                    alt="Hero background preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleHeroImageUpload(e.target.files?.[0])
                  }
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-gray-300 file:bg-white file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-50 file:cursor-pointer cursor-pointer"
                />
                <input
                  type="text"
                  value={form.hero.backgroundImage}
                  onChange={(e) =>
                    updateField('hero.backgroundImage', e.target.value)
                  }
                  placeholder="Image URL"
                  className={`${inputClass} mt-2`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              value={form.contact.phone}
              onChange={(e) => updateField('contact.phone', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={form.contact.email}
              onChange={(e) => updateField('contact.email', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea
              value={form.contact.address}
              onChange={(e) => updateField('contact.address', e.target.value)}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Working Hours</label>
            <input
              type="text"
              value={form.contact.workingHours}
              onChange={(e) =>
                updateField('contact.workingHours', e.target.value)
              }
              placeholder="Mon - Sat: 10:00 AM - 7:00 PM"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Social Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Instagram</label>
            <input
              type="text"
              value={form.social.instagram}
              onChange={(e) =>
                updateField('social.instagram', e.target.value)
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Facebook</label>
            <input
              type="text"
              value={form.social.facebook}
              onChange={(e) => updateField('social.facebook', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input
              type="text"
              value={form.social.linkedin}
              onChange={(e) => updateField('social.linkedin', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>YouTube</label>
            <input
              type="text"
              value={form.social.youtube}
              onChange={(e) => updateField('social.youtube', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* About Page */}
      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          About Page
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Story Heading</label>
            <input
              type="text"
              value={form.about.storyHeading}
              onChange={(e) =>
                updateField('about.storyHeading', e.target.value)
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Story Paragraph</label>
            <textarea
              value={form.about.storyParagraph}
              onChange={(e) =>
                updateField('about.storyParagraph', e.target.value)
              }
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Legacy Heading</label>
            <input
              type="text"
              value={form.about.legacyHeading}
              onChange={(e) =>
                updateField('about.legacyHeading', e.target.value)
              }
              className={inputClass}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass.replace('mb-1', '')}>
                Legacy Paragraphs
              </label>
              <button
                type="button"
                onClick={addLegacyParagraph}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                <Plus className="w-4 h-4" />
                Add paragraph
              </button>
            </div>
            <div className="space-y-3">
              {form.about.legacyParagraphs.map((para, i) => (
                <div key={i} className="flex items-start gap-2">
                  <textarea
                    value={para}
                    onChange={(e) =>
                      updateLegacyParagraph(i, e.target.value)
                    }
                    rows={3}
                    className={`${inputClass} resize-none flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeLegacyParagraph(i)}
                    disabled={form.about.legacyParagraphs.length <= 1}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0"
                    title="Remove paragraph"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Years of Experience</label>
            <input
              type="number"
              value={form.stats.yearsExperience}
              onChange={(e) =>
                updateField('stats.yearsExperience', Number(e.target.value))
              }
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Properties Sold</label>
            <input
              type="number"
              value={form.stats.propertiesSold}
              onChange={(e) =>
                updateField('stats.propertiesSold', Number(e.target.value))
              }
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Happy Clients</label>
            <input
              type="number"
              value={form.stats.happyClients}
              onChange={(e) =>
                updateField('stats.happyClients', Number(e.target.value))
              }
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Investment Portfolio (₹ Cr)
            </label>
            <input
              type="number"
              value={form.stats.investmentPortfolioCr}
              onChange={(e) =>
                updateField(
                  'stats.investmentPortfolioCr',
                  Number(e.target.value)
                )
              }
              min="0"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Footer</h2>
        <div>
          <label className={labelClass}>Footer Description</label>
          <textarea
            value={form.footer.description}
            onChange={(e) => updateField('footer.description', e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      </section>
    </div>
  );
}

// Deep-merge fetched/saved settings into existing form shape so we never
// lose default keys the API response might omit.
function mergeSettings(prev, incoming) {
  return {
    ...prev,
    ...incoming,
    logo: { ...prev.logo, ...incoming.logo },
    contact: { ...prev.contact, ...incoming.contact },
    social: { ...prev.social, ...incoming.social },
    hero: { ...prev.hero, ...incoming.hero },
    about: {
      ...prev.about,
      ...incoming.about,
      legacyParagraphs:
        incoming.about?.legacyParagraphs?.length > 0
          ? incoming.about.legacyParagraphs
          : prev.about.legacyParagraphs,
    },
    stats: { ...prev.stats, ...incoming.stats },
    footer: { ...prev.footer, ...incoming.footer },
  };
}
