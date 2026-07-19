import React, { useState } from "react";
import { Reference } from "../types";
import { Link2, Plus, Trash2, Globe, ExternalLink } from "lucide-react";

interface ReferencesCompProps {
  references: Reference[];
  onChange: (updated: Reference[]) => void;
}

export default function ReferencesComp({ references, onChange }: ReferencesCompProps) {
  const [newSource, setNewSource] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleFieldChange = (index: number, key: keyof Reference, value: string) => {
    const updated = references.map((ref, idx) => {
      if (idx === index) {
        return { ...ref, [key]: value };
      }
      return ref;
    });
    onChange(updated);
  };

  const handleAddReference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource) return;

    const newRef: Reference = {
      source: newSource,
      url: newUrl || "#",
      description: newDesc
    };

    onChange([...references, newRef]);
    setNewSource("");
    setNewUrl("");
    setNewDesc("");
    setShowAddForm(false);
  };

  const handleDeleteReference = (index: number) => {
    onChange(references.filter((_, idx) => idx !== index));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6" id="references-manager">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans text-lg font-bold text-slate-900">Section 4: Professional Academic & Financial References</h2>
            <p className="text-xs text-slate-500">Document the public reports, balance sheets, and SEC portal filings utilized in compilation</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4 text-slate-500" />
          Add Source Reference
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddReference} className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Configure New Financial Resource</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Source Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bloomberg Terminal, SEC 10-K Filings"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:border-indigo-500 outline-hidden focus:ring-1 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Source URL / Identifier</label>
              <input
                type="url"
                placeholder="https://example.com/source"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:border-indigo-500 outline-hidden focus:ring-1 focus:ring-indigo-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Research Description / Utilization</label>
            <input
              type="text"
              placeholder="Explain how this reference was used to compile data..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:border-indigo-500 outline-hidden focus:ring-1 focus:ring-indigo-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs"
            >
              Add Reference
            </button>
          </div>
        </form>
      )}

      {/* References list */}
      <div className="space-y-4">
        {references.map((ref, idx) => (
          <div key={idx} className="flex gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-xl bg-slate-50/50 group transition-all">
            <div className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-400 self-start">
              <Globe className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  value={ref.source}
                  onChange={(e) => handleFieldChange(idx, "source", e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 py-0.5 rounded outline-hidden w-64"
                />
                {ref.url && ref.url !== "#" && (
                  <a
                    href={ref.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[10px] text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Visit Portal
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1">
                <input
                  type="text"
                  value={ref.url}
                  placeholder="Reference Link / URL"
                  onChange={(e) => handleFieldChange(idx, "url", e.target.value)}
                  className="text-[10px] text-slate-400 font-mono bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 py-0.5 rounded outline-hidden w-full"
                />
                <textarea
                  value={ref.description}
                  rows={2}
                  placeholder="Explain research application..."
                  onChange={(e) => handleFieldChange(idx, "description", e.target.value)}
                  className="text-xs text-slate-600 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white p-1 rounded outline-hidden w-full resize-none leading-relaxed"
                />
              </div>
            </div>
            <button
              onClick={() => handleDeleteReference(idx)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md self-start opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
              title="Delete reference"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {references.length === 0 && (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-400 italic">No source references registered. Click 'Add Source Reference' to document credentials.</p>
          </div>
        )}
      </div>
    </div>
  );
}
