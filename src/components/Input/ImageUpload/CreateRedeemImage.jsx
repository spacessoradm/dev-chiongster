import { useState } from "react";
import supabase from "../../../config/supabaseClient"; // Ensure Supabase client is initialized

const CreateRedeemImage = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `redeem-${Date.now()}.${fileExt}`;
    const filePath = `redemption/${fileName}`;
    const uploadPath = `${fileName}`;

    try {
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("redemption") // Replace with actual bucket name
        .upload(uploadPath, file, { cacheControl: "3600", upsert: true });

      console.log(uploadError);
      if (uploadError) throw uploadError;

      if (filePath) {
        onUpload(filePath); // Pass image URL to parent component
      } else {
        throw new Error("Public URL could not be retrieved.");
      }
    } catch (error) {
      console.error("Image upload failed:", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="field-container">
      <label>Item Image:</label>
      <input type="file" className="enhanced-input" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
};

export default CreateRedeemImage;
