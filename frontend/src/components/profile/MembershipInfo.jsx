import React from "react";

const MembershipInfo = ({ memberships }) => {
  if (!memberships || memberships.length === 0) {
    return <p className="text-gray-600">보유 중인 활성된 이용권이 없습니다.</p>;
  }

  return (
    <div className="spacy4">
      {memberships.map((membership) => (
        <div
          key={membership.id}
          className="p-4 border rounded-lg bg-white shadow-sm"
        >
          <h4 className="font-semibold text-gray-800">
            {membership.productName}
          </h4>
          <div className="space-y-1 text-sm mt-2">
            <p>
              <strong>상태:</strong>
              <span
                className={`font-bold ml-2 ${
                  membership.status === "ACTIVE"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {membership.status === "ACTIVE" ? "활성" : "만료됨"}
              </span>
            </p>
            {membership.productType === "Membership" ? (
              <>
                <p>
                  <strong>시작일:</strong> {membership.startDate}
                </p>
                <p>
                  <strong>만료일:</strong> {membership.endDate}
                </p>
              </>
            ) : (
              <p>
                <strong>남은 PT 횟수:</strong>
                <span className="font-bold ml-2 text-blue-600">
                  {membership.ptCountRemaining}회
                </span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembershipInfo;
