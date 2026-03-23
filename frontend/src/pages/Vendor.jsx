import React, { useState } from "react";

export default function Vendor() {

  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    businessAddress: "",
    gstNumber: "",
    panNumber: "",
    productCategories: [],
    annualTurnover: "",
    employeeCount: "",
    businessDescription: "",
    termsAccepted: false
  });

  const businessTypes = [
    "Manufacturer", "Wholesaler", "Distributor", "Retailer", "Importer", "Exporter",
    "Service Provider", "E-commerce Seller", "Franchise", "Startup", "Other"
  ];

  const productCategories = [
    "Electronics", "Fashion & Apparel", "Home & Kitchen", "Industrial Equipment",
    "Office Supplies", "Packaging Materials", "Raw Materials", "Chemicals",
    "Machinery", "Automotive Parts", "Construction Materials", "Medical Supplies",
    "IT & Software", "Consulting Services", "Other"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }
    alert("Thank you for your application! Our business development team will contact you within 2-3 business days.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Join Our B2B Network
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Connect with thousands of businesses across India. Expand your reach,
            streamline procurement, and grow your enterprise with our comprehensive
            B2B marketplace platform.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-14">
          <div className="bg-white shadow-lg rounded-xl p-6 text-center border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Scale Your Business
            </h3>
            <p className="text-gray-600 text-sm">
              Access millions in potential revenue through our extensive business network.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Streamlined Operations
            </h3>
            <p className="text-gray-600 text-sm">
              Automated order processing, inventory management, and payment systems.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-purple-600 mb-2">
              Business Intelligence
            </h3>
            <p className="text-gray-600 text-sm">
              Advanced analytics and insights to optimize your business decisions.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Dedicated Support
            </h3>
            <p className="text-gray-600 text-sm">
              24/7 business support with dedicated account managers for enterprise clients.
            </p>
          </div>
        </div>

        {/* Business Registration Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Business Registration Application
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600 font-bold">1</span>
                Company Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter your registered company name"
                    required
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                  <select
                    name="businessType"
                    required
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    placeholder="Full name of primary contact"
                    required
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    placeholder="https://www.yourcompany.com"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
                  <textarea
                    name="businessAddress"
                    placeholder="Complete registered business address"
                    rows="3"
                    required
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600 font-bold">2</span>
                Contact Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="business@company.com"
                    required
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    required
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 text-purple-600 font-bold">3</span>
                Business Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="22AAAAA0000A1Z5"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    placeholder="AAAAA0000A"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Turnover</label>
                  <select
                    name="annualTurnover"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">Select annual turnover</option>
                    <option>Under ₹1 Crore</option>
                    <option>₹1-5 Crore</option>
                    <option>₹5-25 Crore</option>
                    <option>₹25-100 Crore</option>
                    <option>Above ₹100 Crore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee Count</label>
                  <select
                    name="employeeCount"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">Select employee count</option>
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-1000 employees</option>
                    <option>1000+ employees</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 text-orange-600 font-bold">4</span>
                Product Categories *
              </h3>
              <p className="text-sm text-gray-600 mb-4">Select all categories that apply to your business</p>
              <div className="grid md:grid-cols-3 gap-3">
                {productCategories.map(category => (
                  <label key={category} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={formData.productCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Business Description */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold">5</span>
                Business Description
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about your business *</label>
                <textarea
                  name="businessDescription"
                  placeholder="Describe your products, target market, unique selling propositions, and business goals..."
                  rows="5"
                  required
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and
                  <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>.
                  I understand that my application will be reviewed and I may be contacted for additional documentation.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              Submit Business Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}