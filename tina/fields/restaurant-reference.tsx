import React, { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { BaseTextField, Button, ReferenceField, useCMS } from "tinacms";

// Reviews reference a restaurant document so a venue can be reviewed more than
// once. Tina's stock reference field only lets you pick an existing document,
// which forced a detour to the Restaurants collection before every review of a
// new venue. This field wraps the stock picker and adds an inline "new
// restaurant" form that creates the document through the same GraphQL mutation
// the admin uses, then selects it.

const COLLECTION = "restaurant";
const COLLECTION_PATH = "content/restaurant";

// Mirrors the admin's default filename rule for a collection with an isTitle
// field, so restaurants made here look like ones made in the collection view.
const filenameFor = (name: string) =>
  name.trim().replace(/ /g, "-").replace(/[^a-zA-Z0-9-]/g, "");

const CREATE_RESTAURANT = `#graphql
mutation($relativePath: String!, $params: DocumentMutation!) {
  createDocument(collection: "${COLLECTION}", relativePath: $relativePath, params: $params) {
    __typename
  }
}`;

// Same classes Tina uses for its own "EDIT IN CMS" link under a reference, so
// the two actions read as one row of field actions.
const ACTION_LINK_CLASS =
  "text-gray-700 hover:text-blue-500 inline-flex items-center uppercase text-sm mt-2 mb-2 leading-none";

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  hint,
  autoFocus,
  inputRef,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  autoFocus?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}) => (
  <label className="block mb-4">
    <span className="block text-xs font-semibold text-gray-700 mb-1">{label}</span>
    <BaseTextField
      ref={inputRef}
      value={value}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onChange={(event) => onChange(event.target.value)}
    />
    {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
  </label>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RestaurantReference = (props: any) => {
  const cms = useCMS();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The stock picker loads its options once on mount. Bumping the key after a
  // create remounts it so the new restaurant appears in the list.
  const [pickerKey, setPickerKey] = useState(0);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) nameRef.current?.focus();
  }, [open]);

  const canCreate = name.trim().length > 0 && url.trim().length > 0 && !saving;

  const reset = () => {
    setName("");
    setUrl("");
    setLocation("");
    setError(null);
    setOpen(false);
  };

  const create = async () => {
    if (!canCreate) return;
    const filename = filenameFor(name);
    if (!filename) {
      setError("Name needs at least one letter or number.");
      return;
    }
    const relativePath = `${filename}.md`;
    setSaving(true);
    setError(null);
    try {
      await cms.api.tina.request(CREATE_RESTAURANT, {
        variables: {
          relativePath,
          params: {
            [COLLECTION]: {
              name: name.trim(),
              url: url.trim(),
              location: location.trim() || undefined,
            },
          },
        },
      });
      props.input.onChange(`${COLLECTION_PATH}/${relativePath}`);
      setPickerKey((key) => key + 1);
      cms.alerts.success(`Created restaurant "${name.trim()}"`);
      reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(
        /exist/i.test(message)
          ? `A restaurant file named "${relativePath}" already exists. Pick it from the list above.`
          : message
      );
    } finally {
      setSaving(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      create();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      reset();
    }
  };

  // Tina lays fields out as `w-full px-2 mb-5` blocks in a flex-wrap row. Our
  // additions render as siblings of the picker's block, so they need the same
  // wrapper to line up with it; the negative top margin tucks them under the
  // picker's "Edit in CMS" link instead of leaving a field-sized gap.
  return (
    <>
      <ReferenceField key={pickerKey} {...props} />
      <div className="w-full px-2 mb-5" style={{ marginTop: "-16px" }}>
        {!open && (
          <button type="button" className={ACTION_LINK_CLASS} onClick={() => setOpen(true)}>
            <BiPlus className="h-5 w-auto opacity-80 mr-2" />
            New restaurant
          </button>
        )}
        {open && (
        <div
          className="w-full mt-2 p-4 border border-gray-200 rounded bg-white shadow-sm"
          onKeyDown={onKeyDown}
        >
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-sm font-semibold text-gray-800">New restaurant</span>
            <span className="text-xs text-gray-500">Saved to the Restaurants collection and selected above</span>
          </div>
          <Field
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Penguin Pub"
            inputRef={nameRef}
            autoFocus
          />
          <Field
            label="Website"
            value={url}
            onChange={setUrl}
            placeholder="https://"
          />
          <Field
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="Penguin Pub, Penguin, Tasmania"
            hint="Used for the map pin. Name and suburb is enough. Leave blank to use the name."
          />
          {error && <p className="text-xs text-red-700 mb-4">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="white" size="small" disabled={saving} onClick={reset}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="small"
              busy={saving}
              disabled={!canCreate}
              onClick={create}
            >
              Create restaurant
            </Button>
          </div>
        </div>
        )}
      </div>
    </>
  );
};
