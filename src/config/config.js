const config = {
  data: {
    // Main invitation title that appears on the page
    title: "Beknur & Assem Той",
    // Opening message/description of the invitation
    description:
      "Біз үйленеміз және сіздерді осы ерекше сәтке қошылуға шақырамыз.", // Nanti ini dibikin random
    // Groom's name
    groomName: "Beknur",
    // Bride's name
    brideName: "Assem",
    // Groom's parents names
    parentGroom: "Beknur Ата-Анасы",
    // Bride's parents names
    parentBride: "Assem Ата-Анасы",
    // Wedding date (format: YYYY-MM-DD)
    date: "2026-06-12",
    // Google Maps link for location (short clickable link)
    maps_url: "https://maps.app.goo.gl/bjWze89FMTytNBgr7",
    // Google Maps embed code to display map on website
    // How to get: open Google Maps → select location → Share → Embed → copy link
    maps_embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20025.36779276224!2d71.41965246595538!3d51.14219815864293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424586998620b1d5%3A0x5dc6bb1ea2c16fe2!2sAstana%20Opera!5e0!3m2!1sen!2sit!4v1778535905571!5m2!1sen!2sit",
    // Event time (free format, example: "10:00 - 12:00 ҚАТМ")
    time: "16:16 - 17:30",
    // Venue/building name
    location: "Беңгі Залы, Құрметті Сарай",
    // Full address of the wedding venue
    address: "Дінмұхамед Қонаев көшесі 1, Астана, Қазақстан",
    // Image that appears when link is shared on social media
    ogImage: "/images/og-image.jpg",
    // Icon that appears in browser tab
    favicon: "/images/favicon.ico",
    // List of event agenda/schedule
    agenda: [
      {
        // First event name
        title: "Сүндет Той",
        // Event date (format: YYYY-MM-DD)
        date: "2026-06-12",
        // Start time (format: HH:MM)
        startTime: "16:16",
        // End time (format: HH:MM)
        endTime: "17:30",
        // Event venue
        location: "Беңгі Залы, Құрметті Сарай",
        // Full address
        address: "Дінмұхамед Қонаев көшесі 1, Астана, Қазақстан",
      },
      {
        // Second event name
        title: "Той Ереже",
        date: "2026-06-12",
        startTime: "16:16",
        endTime: "17:30",
        location: "Беңгі Залы, Құрметті Сарай",
        address: "Дінмұхамед Қонаев көшесі 1, Астана, Қазақстан",
      },
      // You can add more agenda items with the same format
    ],

    // Background music settings
    audio: {
      // Music file (choose one or replace with your own file)
      src: "/audio/fulfilling-humming.mp3", // or /audio/nature-sound.mp3
      // Music title to display
      title: "Төлеген Асхаров - Том Томпа",
      // Whether music plays automatically when website opens
      autoplay: true,
      // Whether music repeats continuously
      loop: true,
    },
  },
};

export default config;
