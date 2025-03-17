import React from "react";
import { IPageData } from "@/types/page";

interface PageListProps {
  pages: IPageData[];
  onEdit: (slug: string) => void;
  onDelete: (id: string) => void;
}

const PageList: React.FC<PageListProps> = ({ pages, onEdit, onDelete }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Slug
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Location
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Modified
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {pages.map((page) => (
          <tr key={page._id}>
            <td className="px-6 py-4 whitespace-nowrap">{page.title}</td>
            <td className="px-6 py-4 whitespace-nowrap">{page.slug}</td>
            <td className="px-6 py-4 whitespace-nowrap capitalize">
              {page.location}
            </td>
            <td className="px-6 py-4 whitespace-nowrap capitalize">
              {page.status}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {new Date(page.updatedAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => onEdit(page.slug)}
                className="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(page._id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PageList;
