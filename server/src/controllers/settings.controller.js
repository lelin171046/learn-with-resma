const SiteSettings = require('../models/SiteSettings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      const allowed = [
        'siteName', 'tagline', 'contactEmail', 'phone', 'address',
        'facebook', 'twitter', 'instagram', 'youtube', 'linkedin',
        'logo', 'favicon', 'footerText', 'metaDescription',
      ];
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          settings[key] = req.body[key];
        }
      }
      await settings.save();
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
