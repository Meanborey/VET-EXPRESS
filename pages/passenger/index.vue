<template>
   <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto py-10">
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
               <!-- Passenger Detail -->
               <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-center justify-between mb-4">
                     <h2 class="text-base font-semibold text-gray-800">Passenger Detail</h2>
                  </div>
                  <div class="border-t border-gray-100 pt-4">
                     <div class="text-sm font-semibold text-gray-700 mb-3">
                        Passenger 1: <span class="text-blue-600">#7A</span>
                     </div>
                     <div class="flex items-center gap-6 mb-4">
                        <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                           <input type="radio" name="gender" class="text-orange-500" />
                           Female
                        </label>
                        <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                           <input type="radio" name="gender" class="text-orange-500" />
                           Male
                        </label>
                     </div>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Full name"
                           class="w-full h-11 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        <select
                           class="w-full h-11 px-3 rounded-md border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                           <option>Nationality</option>
                           <option>Khmer</option>
                           <option>Thai</option>
                           <option>Vietnamese</option>
                        </select>
                     </div>

                     <div class="mt-6 space-y-4">
                        <div class="flex items-center justify-between">
                           <h3 class="text-sm font-semibold text-gray-700">Boarding Point</h3>
                           <button class="text-xs font-semibold text-orange-500 hover:text-orange-600">View Map</button>
                        </div>
                        <div class="border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                           <div class="flex items-start gap-2">
                              <span class="mt-0.5">📍</span>
                              <div>
                                 <div class="font-semibold">Phnom Penh (Cannon Rifle Roundabout Park) - 01:00</div>
                                 <div class="text-gray-600">Okhna Dekcho Ei (St. 76) Conner France St. (47), Phnom Penh, Cambodia</div>
                              </div>
                           </div>
                        </div>
                        <div class="text-xs text-indigo-700">
                           Please make sure you come to the correct boarding point that you have chosen as some schedules do not have same
                           price. In case you chose the boarding point with lower price and come to boarding point with higher price, we will
                           charge extra.
                        </div>

                        <div class="flex items-center justify-between pt-2">
                           <h3 class="text-sm font-semibold text-gray-700">Drop Off Point</h3>
                           <button class="text-xs font-semibold text-orange-500 hover:text-orange-600">View Map</button>
                        </div>
                        <div class="border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                           <div class="flex items-start gap-2">
                              <span class="mt-0.5">📍</span>
                              <div>
                                 <div class="font-semibold">Phnom Penh (Cannon Rifle Roundabout Park) - 07:00</div>
                                 <div class="text-gray-600">Huy Leng Market Road, Taphul Village, Svay Dangkum Municiple, Krong Siem Reap, Siem Reap Province</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Contact Details -->
               <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-start gap-3 mb-4">
                     <div class="w-1 h-5 bg-orange-500 rounded"></div>
                     <div>
                        <h2 class="text-base font-semibold text-gray-800">Contact Details</h2>
                        <p class="text-xs text-gray-500">Your booking detail ticket will be sent your email address</p>
                     </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input type="email" placeholder="Email address"
                        class="w-full h-11 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                     <input type="text" placeholder="Phone number"
                        class="w-full h-11 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
               </div>

               <!-- Noted -->
               <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg">
                        💡
                     </div>
                     <div>
                        <div class="text-sm font-semibold text-gray-800 mb-2">Noted *</div>
                        <div class="text-sm text-gray-700 mb-2">Attention! Information for Sleeper Bus*</div>
                        <div class="text-sm text-gray-600">Beds are designed for two people. We are sorry if your bed have difference gender, we will change.</div>
                     </div>
                  </div>
                  <div class="border-t border-gray-100 my-5"></div>
                  <div class="text-sm font-semibold text-gray-800 mb-3">Discount coupon</div>
                  <label class="inline-flex items-center gap-3 text-sm text-gray-700 mb-6">
                     <input type="checkbox" class="w-4 h-4 text-orange-500" />
                     Apply Travel Package Code
                  </label>
                  <label class="inline-flex items-center gap-3 text-sm text-gray-700 mb-6">
                     <input type="checkbox" class="w-4 h-4 text-orange-500" />
                     By clicking on "Process Payment", you agree to the Terms & Conditions and Privacy Policy
                  </label>
                  <button class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-between px-6">
                     <span>Process Payment</span>
                     <span>→</span>
                  </button>
               </div>
            </div>

            <!-- Booking Summary -->
            <div class="lg:col-span-1">
               <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-20">
                  <h2 class="text-base font-semibold text-gray-800 mb-4">Booking summary</h2>
                  <div class="text-sm text-gray-700">Phnom Penh - Siem Reap</div>
                  <div class="text-sm text-gray-500 mt-1">2026-02-11</div>
                  <div class="border-t border-gray-100 my-4"></div>
                  <div class="flex items-center justify-between text-sm text-gray-700">
                     <span>Trip Price</span>
                     <span>$16.15</span>
                  </div>
                  <div class="border-t border-gray-100 my-4"></div>
                  <button class="text-sm text-blue-600 hover:text-blue-700">View Trip Details</button>
                  <div class="border-t border-gray-100 my-4"></div>
                  <div class="flex items-center justify-between text-sm text-gray-700 mb-2">
                     <span>Grand Total:</span>
                     <span>$16.15</span>
                  </div>
                  <div class="flex items-center justify-between text-sm text-gray-700 mb-2">
                     <span>Discount (%):</span>
                     <span>$0.00</span>
                  </div>
                  <div class="flex items-center justify-between text-sm font-semibold text-gray-800">
                     <span>Total:</span>
                     <span>$16.15</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>