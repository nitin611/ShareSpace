import React, { useState, useEffect } from "react";
import Structure from "../../Components/structure/Structure";
import UserMenu from "../../Components/structure/UserMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams(); // Get product ID from URL params

  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [id,setId]=useState("");

  // Get all categories
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/category/getCategories");
        if (data?.success) setCategories(data.category);
      } catch (err) {
        console.log(err);
        toast.error("Error in getting the category");
      }
    };
    getAllCategories();
  }, []);

  // Get single product details
  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/product/get-product/${productId}`);
        const product = data.product;
        setName(product.name);
        setId(product._id)
        setDescription(product.description);
        setPrice(product.price);
        // yahan ._id karna para kyuki ye string and id dono pass horahi isliye error aaraha so we are sending id
        setCategory(product.category._id);
        setQuantity(product.quantity);
        setShipping(product.shipping ? "1" : "0");
      } catch (err) {
        console.log(err);
        toast.error("Error in fetching product details");
      }
    };
    getSingleProduct();
    // eslint-disable-next-line
  }, [productId]);

  // Update product function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("shipping", shipping);
      if (photo) formData.append("photo", photo);

      const { data } = await axios.put(`http://localhost:8080/api/product/updating-product/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data?.success) {
        toast.success("Product updated successfully");
        navigate("/dashboard/user/products");
      } else {
        toast.error(data?.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error in updating the product");
    }
  };

  return (
    <Structure title={"Create Product -ShareSpace App"}>
      <div className="container mx-auto p-6">
        <div className="flex">
          {/* User Menu (30%) */}
          <div className="w-1/3 pr-4">
            <UserMenu />
          </div>

          {/* Create Product Form (70%) */}
          <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
               <h1 className="text-2xl font-semibold text-gray-800 mb-6">Update Product</h1>
  <div className="space-y-4">
    <Select
      className="w-full text-gray-700 border border-gray-300 rounded-md p-2"
      placeholder="Select a category"
      size="large"
      showSearch
      bordered={false}
      // antdesign ki madad se value change kar sakte hai directly
      onChange={(value) => {
        setCategory(value);
      }}
      value={category}
    >
      {/* categories ke upar map karo and return karado */}
      {categories?.map((c) => (
        // print value and name of categories- 
        <Option key={c._id} value={c._id}>
          {c.name}
        </Option>
      ))}
    </Select>

    <div className="w-full">
      <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-100">
        <span className="text-blue-500">
          {/* agar photo hai to photo ka name show karo nahi to upload photo show karo */}
          {photo ? photo.name : "Upload Photo"}
        </span>
        <input
          type="file"
          name="photo"
          // * matlab koi bhi type ki image -jpg,png
          accept="image/*"
          // files array hota hai isliye [0] index liya hai-
          onChange={(e) => setPhoto(e.target.files[0])}
          hidden
        />
      </label>
    </div>

{/* direct browser property se image display karwa rahe hai- */}
{/* update product */}
    {photo ? (
      <div className="flex justify-center">
        <img
        // get photo from url and display below it objecturl se photo get kar lenge
          src={URL.createObjectURL(photo)}
          alt="product_photo"
          className="w-48 h-48 object-cover rounded-md shadow-md"
        />
      </div>
    ):(<div className="flex justify-center">
      <img
      // get photo from url and display below it objecturl se photo get kar lenge
      src={`http://localhost:8080/api/product/product-photo/${id}`}
        alt="product_photo"
        className="w-48 h-48 object-cover rounded-md shadow-md"
      />
    </div>)}

    <input
      type="text"
      value={name}
      placeholder="Product Name"
      className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
      onChange={(e) => setName(e.target.value)}
    />

    <textarea
      value={description}
      placeholder="Product Description"
      className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
      onChange={(e) => setDescription(e.target.value)}
    />

    <input
      type="number"
      value={price}
      placeholder="Price"
      className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
      onChange={(e) => setPrice(e.target.value)}
    />

    <input
      type="number"
      value={quantity}
      placeholder="Quantity"
      className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
      onChange={(e) => setQuantity(e.target.value)}
    />

    <Select
      className="w-full text-gray-700 border border-gray-300 rounded-md p-2"
      placeholder="Select Shipping"
      size="large"
      showSearch
      bordered={false}
      onChange={(value) => {
        setShipping(value);

      }}
      // ye shipping ko update product ke form me update karo 
      value={shipping?"yes":"No"}
    >
      <Option value="0">No</Option>
      <Option value="1">Yes</Option>
    </Select>

    <button
      className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
      onClick={handleUpdate}
    >
      UPDATE PRODUCT
    </button>
  </div>
</div>

        </div>
      </div>
    </Structure>
  );
};

export default UpdateProduct;
