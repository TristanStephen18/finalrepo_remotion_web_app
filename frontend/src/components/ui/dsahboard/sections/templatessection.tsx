import React from "react";
import { templateCategories } from "../../../../data/DashboardCardsData";
import { TemplateCard } from "../TemplateCard";

interface TemplatesSectionProps {
  search: string;
  setSearch: (value: string) => void;
  tab: number;
  setTab: (tab: number) => void;
  onTry: (template: string, description: string) => void;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  search,
  setSearch,
  tab,
  setTab,
  onTry,
}) => {
  const categories = ["For you", ...Object.keys(templateCategories)];
  const allTemplates = Object.values(templateCategories).flat();

  const displayedTemplates =
    tab === 0
      ? allTemplates
      : templateCategories[categories[tab] as keyof typeof templateCategories];

  return (
    <section className="w-full space-y-6 mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Templates
        </h2>

        <input
          type="text"
          placeholder="Search our templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 md:w-96 px-4 py-2 border border-gray-200 rounded-xl 
          shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => {
          const isActive = tab === index;
          return (
            <button
              key={index}
              onClick={() => setTab(index)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Template Grid — auto responsive */}
      <div
        className="
          grid gap-5
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          2xl:grid-cols-5
          [@media(max-width:450px)]:grid-cols-1
        "
      >
        {displayedTemplates
          .filter(
            (t) =>
              t.name.toLowerCase().includes(search.toLowerCase()) ||
              t.description.toLowerCase().includes(search.toLowerCase())
          )
          .map((template) => (
            <TemplateCard
              key={template.name}
              label={template.url}
              name = {template.name}
              description={template.description}
              onTry={onTry}
            />
          ))}
      </div>
    </section>
  );
};
