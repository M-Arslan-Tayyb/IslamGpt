import LoadingSkeleton from "@/components/common/LoadingSkelton";
import FormattedText from "./FormatedText";

const ResourceList = ({ query, aiResponse, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm p-6">
      {aiResponse ? (
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            {/* Formatted AI Response */}
            <div className="text-gray-700">
              <FormattedText text={aiResponse} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Coming Soon
          </h3>
        </div>
      )}
    </div>
  );
};

export default ResourceList;
