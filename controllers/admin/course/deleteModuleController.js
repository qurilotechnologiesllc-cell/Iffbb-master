import Course from "../../../models/courseModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

const extractPublicId = (url, resourceType = 'image') => {
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    let publicId = url.substring(uploadIndex + 8);
    publicId = publicId.replace(/^v\d+\//, ''); // version hata do

    // ✅ raw files mein extension rehne do — image/video mein hatao
    if (resourceType !== 'raw') {
      publicId = publicId.replace(/\.[^/.]+$/, '');
    }

    return publicId;
  } catch {
    return null;
  }
};

export const deleteModuleController = async (req, res) => {
  const { moduleId } = req.params;

  if (!moduleId) {
    return res.status(400).json({ message: "No Module Id Provided" });
  }

  try {
    const course = await Course.findOne({ "modules._id": moduleId });
    if (!course) return res.status(404).json({ message: "Module not found" });

    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    // ✅ Cloudinary se delete karo — sirf Cloudinary URLs
    if (module.assetLink && module.assetLink.length > 0) {
      for (const url of module.assetLink) {

        // Purane server URLs skip karo
        if (!url.includes('res.cloudinary.com')) continue;

        const resourceType = module.type === 'pdf' ? 'raw' : 'video';
        const publicId = extractPublicId(url, resourceType); // ✅ resourceType pass karo

        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        }
      }
    }

    // ✅ Module DB se delete karo
    course.modules.pull(moduleId);
    await course.save();

    return res.status(200).json({ message: "Module deleted successfully" });

  } catch (error) {
    console.error("Cannot delete module", error);
    return res.status(500).json({ message: "Cannot Delete Module" });
  }
};