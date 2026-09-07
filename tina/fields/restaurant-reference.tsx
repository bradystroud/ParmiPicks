import React, { useState } from "react";
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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#4b5563",
  marginBottom: "4px",
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <label style={{ display: "block", marginBottom: "10px" }}>
    <span style={labelStyle}>{label}</span>
    <BaseTextField
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
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

  const reset = () => {
    setName("");
    setUrl("");
    setLocation("");
    setError(null);
    setOpen(false);
  };

  const create = async () => {
    const filename = filenameFor(name);
    if (!name.trim() || !filename) {
      setError("Name is required.");
      return;
    }
    if (!url.trim()) {
      setError("Url is required.");
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

  return (
    <>
      <ReferenceField key={pickerKey} {...props} />
      {open ? (
        <div
          style={{
            marginTop: "8px",
            padding: "12px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            background: "#f9fafb",
          }}
        >
          <Field label="Name" value={name} onChange={setName} placeholder="Penguin Pub" />
          <Field label="Url (e.g. restaurant website)" value={url} onChange={setUrl} placeholder="https://" />
          <Field
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="Penguin Pub, Penguin, Tasmania"
          />
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 10px" }}>
            Location is for Google Maps. Name and suburb is normally enough. If left blank the name is used.
          </p>
          {error && (
            <p style={{ fontSize: "12px", color: "#b91c1c", margin: "0 0 10px" }}>{error}</p>
          )}
          <div style={{ display: "flex", gap: "8px" }}>
            <Button type="button" variant="primary" size="small" busy={saving} disabled={saving} onClick={create}>
              Create and select
            </Button>
            <Button type="button" variant="white" size="small" disabled={saving} onClick={reset}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="white"
          size="small"
          style={{ marginTop: "8px" }}
          onClick={() => setOpen(true)}
        >
          + New restaurant
        </Button>
      )}
    </>
  );
};
