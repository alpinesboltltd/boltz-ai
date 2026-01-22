"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { FeaturesTableItem as features } from "@/lib/static/landing";


export function FeaturesTable() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Comprehensive Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build powerful AI chatagents
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Compare our features across different plans and see the platforms we
            integrate with.
          </p>
        </div>

        <div className="mt-16 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Feature
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Free
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Pro
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Business
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {features.map((feature) => (
                <tr key={feature.name}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {feature.name}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <div>
                      <p>{feature.description}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        <span className="font-medium">Integrations:</span>{" "}
                        {feature.platforms}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {feature.tiers.free ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {feature.tiers.pro ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {feature.tiers.business ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
