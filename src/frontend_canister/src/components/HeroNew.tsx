import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

const HeroNew = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-primary to-secondary text-white relative verflow-hidden h-[800px] mdi:pt-20 ">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center h-full">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-6xl font-bold leading-tight">
                {t("hero.title")}
              </h2>
              <p className="text-2xl font-light">{t("hero.subtitle")}</p>
            </div>
            <p className="text-xl text-gray-200 leading-relaxed">
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-accent text-dark px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center">
                <FontAwesomeIcon
                  icon={["fab", "apple"]}
                  className="ml-3 text-xl"
                />
                {t("hero.appStore")}
              </button>
              <button className="bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                <FontAwesomeIcon
                  icon={["fab", "google-play"]}
                  className="ml-3 text-xl"
                />
                {t("hero.googlePlay")}
              </button>
            </div>
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-gray-300">{t("hero.users")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-gray-300">
                  {t("hero.dailyActivities")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-sm text-gray-300">{t("hero.sports")}</div>
              </div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative z-10">
              <img
                className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
                src="./playToGether.png"
                alt="modern Egyptian young people playing football together in Cairo, vibrant community sports scene, mobile app interface mockup"
              />
            </div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-highlight rounded-full opacity-30 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroNew;
