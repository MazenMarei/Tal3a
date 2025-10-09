import { useTranslation } from "react-i18next";

const CommunitySection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      nameKey: "community.testimonials.ahmed.name",
      locationKey: "community.testimonials.ahmed.location",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
      testimonialKey: "community.testimonials.ahmed.testimonial",
    },
    {
      nameKey: "community.testimonials.fatma.name",
      locationKey: "community.testimonials.fatma.location",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
      testimonialKey: "community.testimonials.fatma.testimonial",
    },
    {
      nameKey: "community.testimonials.karim.name",
      locationKey: "community.testimonials.karim.location",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg",
      testimonialKey: "community.testimonials.karim.testimonial",
    },
  ];

  const stats = [
    {
      number: "50,000+",
      labelKey: "community.stats.activeMembers",
    },
    {
      number: "1,000+",
      labelKey: "community.stats.dailyActivities",
    },
    {
      number: "25+",
      labelKey: "community.stats.differentSports",
    },
    {
      number: "15+",
      labelKey: "community.stats.governorates",
    },
  ];

  return (
    <section
      id="community"
      className="py-20 bg-gradient-to-b from-primary to-secondary dark:from-primary-dark text-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-bold mb-6">{t("community.title")}</h3>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            {t("community.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10  p-6 rounded-2xl backdrop-blur-sm"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt="User"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h5 className="font-semibold">{t(testimonial.nameKey)}</h5>
                    <p className="text-sm text-gray-300">
                      {t(testimonial.locationKey)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-200">{t(testimonial.testimonialKey)}</p>
              </div>
            ))}
          </div>

          <div className="relative">
            <img
              className="w-full rounded-3xl shadow-2xl"
              src="./communityPhoto.png"
              alt="diverse group of young Egyptian people celebrating after sports activity, community spirit, friendship and fitness"
            />
            <div className="absolute -top-4 -right-4 bg-accent text-dark p-4 rounded-2xl shadow-lg">
              <div className="text-2xl font-bold">4.8⭐</div>
              <div className="text-sm">{t("community.userRating")}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm"
            >
              <div className="text-3xl font-bold mb-2">{stat.number}</div>
              <div className="text-gray-300">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
