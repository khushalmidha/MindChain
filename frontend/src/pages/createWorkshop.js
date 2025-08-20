import React, { useState, useContext, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaImage, FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import { BackendUrl } from '../data/const';

const CreateWorkshop = () => {
  const { walletAddress } = useContext(WalletContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Redirect if wallet is not connected
  useEffect(() => {
    if (!walletAddress) {
      toast.error('Please connect your wallet to create a workshop',{
        toastId:'wallet-not-connected'
      });
      navigate('/');
    }
  }, [walletAddress, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      // Create a preview URL
      // const previewUrl = URL.createObjectURL(file);
      // setPreviewImage(previewUrl);
      
      // // Create form data for upload
      // const uploadData = new FormData();
      // uploadData.append('file', file);
      // uploadData.append('upload_preset', 'mindchain_uploads'); // Set your Cloudinary upload preset
      // uploadData.append('cloud_name', 'your-cloud-name'); // Replace with your Cloudinary cloud name
      
      // // Upload to Cloudinary
      // const response = await axios.post(
      //   'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', // Replace with your cloud name
      //   uploadData
      // );
      
      // setFormData(prev => ({
      //   ...prev,
      //   imageUrl: response.data.secure_url
      // }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setLoading(true);
      
      const workshopData = {
        ...formData,
        price: Number(formData.price),
        address: walletAddress
      };
      
      const response = await axios.post(`${BackendUrl}/workshop/create-workshop`, workshopData);
      if(response.status === 201) {
        console.log('Workshop created Successfully');
        setFormData({
          title: '',
          description: '',
          price: '',
          imageUrl: ''
        });
      }
      toast.success('Workshop created successfully!');
      navigate('/my-workshops');
    } catch (error) {
      console.error('Error creating workshop:', error);
      toast.error(error.response?.data?.message || 'Failed to create workshop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            <span className="bg-clip-text  text-[#f58b44]">
              Create a Workshop
            </span>
          </h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-400">
            Share your knowledge with the MindChain community
          </p>
        </div>

        {/* Workshop Creation Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Title Input */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Workshop Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Introduction to Blockchain Development"
                  className={`appearance-none block w-full px-3 py-3 border ${
                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Price Input */}
              <div className="mb-6">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price (PYUSD) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`appearance-none block w-full pl-7 pr-12 py-3 border ${
                      errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">PYUSD</span>
                  </div>
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              {/* Description Textarea */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Provide a detailed description of your workshop..."
                  className={`appearance-none block w-full px-3 py-3 border ${
                    errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Minimum 20 characters. Describe what participants will learn.
                </p>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Workshop Cover Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                  {!previewImage ? (
                    <div className="space-y-1 text-center">
                      <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-600 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                          <span className="px-2 py-1">Upload an image</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <div className="relative h-40 md:h-60 w-full">
                        <img 
                          src={previewImage} 
                          alt="Workshop preview" 
                          className="h-full w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                      <p className="text-xs mt-2 text-center text-gray-500 dark:text-gray-400">
                        {formData.imageUrl ? 'Image uploaded successfully' : 'Preview image (still uploading...)'}
                      </p>
                    </div>
                  )}
                  
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-md">
                      <FaSpinner className="animate-spin h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className={`${
                    loading || uploadingImage
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#f58b44] onhover:bg-[#d67a3a]'
                  } w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                  ) : (
                    <FaUpload className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Creating Workshop...' : 'Create Workshop'}
                </button>
              </div>
            </form>
          </div>

          {/* Form Tips */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Workshop Creation Tips:</h3>
            <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside space-y-1">
              <li>Use a clear, descriptive title that indicates what participants will learn</li>
              <li>Set a fair price based on the value and depth of your content</li>
              <li>Include learning objectives and target audience in your description</li>
              <li>Choose an eye-catching image that represents your workshop's topic</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkshop;