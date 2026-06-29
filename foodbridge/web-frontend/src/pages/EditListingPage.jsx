import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api, { BASE_URL } from '../api/axios';

const EditListingPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        foodName: '',
        category: 'cooked',
        quantity: '',
        unit: 'kg',
        pickupTime: '',
        expiryTime: '',
        description: '',
        listingType: 'regular'
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await api.get(`/listings/${id}`);
                const data = res.data;
                setFormData({
                    foodName: data.foodName,
                    category: data.category,
                    quantity: data.quantity,
                    unit: data.unit,
                    pickupTime: data.pickupTime ? new Date(data.pickupTime).toISOString().slice(0, 16) : '',
                    expiryTime: data.expiryTime ? new Date(data.expiryTime).toISOString().slice(0, 16) : '',
                    description: data.description || '',
                    listingType: data.listingType || 'regular'
                });
                if (data.imageUrl) {
                    setImagePreview(data.imageUrl.startsWith('http') ? data.imageUrl : `${BASE_URL}${data.imageUrl}`);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                alert('Failed to fetch listing details');
            } finally {
                setFetching(false);
            }
        };
        fetchListing();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) {
            data.append('image', image);
        }

        try {
            await api.put(`/listings/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/provider/listings');
        } catch (err) {
            console.error('Update error:', err);
            const message = err.response?.data?.message || 'Failed to update listing';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <DashboardLayout title="Loading..."></DashboardLayout>;

    return (
        <DashboardLayout title="Edit Food Listing">
            <div className="max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 lg:p-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Food Name / Description</label>
                            <input
                                type="text" name="foodName" required
                                placeholder="e.g. 10 Loaves of Fresh Sourdough Bread"
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 focus:border-green-600 outline-none"
                                value={formData.foodName} onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                            <select name="category" className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-green-600 outline-none" value={formData.category} onChange={handleInputChange}>
                                <option value="cooked">Cooked Food</option>
                                <option value="raw">Raw Materials</option>
                                <option value="packaged">Packaged Goods</option>
                                <option value="beverages">Beverages</option>
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                                <input type="number" name="quantity" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none" value={formData.quantity} onChange={handleInputChange} />
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
                                <select name="unit" className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none font-bold" value={formData.unit} onChange={handleInputChange}>
                                    <option value="kg">KG</option>
                                    <option value="portions">Portions</option>
                                    <option value="boxes">Boxes</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Available for Pickup</label>
                            <input type="datetime-local" name="pickupTime" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none" value={formData.pickupTime} onChange={handleInputChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Expires At</label>
                            <input type="datetime-local" name="expiryTime" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none" value={formData.expiryTime} onChange={handleInputChange} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes (Optional)</label>
                            <textarea name="description" rows="3" className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none" value={formData.description} onChange={handleInputChange}></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Food Image</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="food-image"
                                />
                                <label
                                    htmlFor="food-image"
                                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:border-green-600 hover:bg-green-50 transition-all bg-cover bg-center"
                                    style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none' }}
                                >
                                    {!imagePreview && (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="text-4xl mb-2">📸</div>
                                            <p className="text-sm text-slate-500 font-bold">Click to change food photo</p>
                                        </div>
                                    )}
                                    {imagePreview && (
                                        <div className="bg-black/50 p-2 rounded-lg text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            Change Photo
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest"
                    >
                        {loading ? 'Saving...' : 'Update Listing'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditListingPage;
