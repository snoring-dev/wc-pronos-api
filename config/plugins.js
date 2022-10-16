module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  'teams-seeder': {
    enabled: true,
    resolve: './src/plugins/teams-seeder'
  },
  'live-match': {
    enabled: true,
    resolve: './src/plugins/live-match'
  },
  'import-export-entries': {
    enabled: true,
  },
});
