import type { TopbarData } from "./queries"

import { TopbarLocation } from "./topbar-location"
import { TopbarCallback } from "./topbar-callback"
import { TopbarCustomers } from "./topbar-customers"
import { TopbarForBusiness } from "./topbar-for-business"

export const Topbar = (props: TopbarData) => {
	const { location, locations } = props

	return (
		<div className="w-full bg-neutral hidden sm:block">
			<div className="mx-auto px-4 py-2 max-w-360 flex items-center">
				<TopbarLocation
					location={location}
					locations={locations}
				/>

				<div className="ms-auto flex items-center gap-4">
					<TopbarCallback phoneNumber={location?.phoneNumber}/>
					<TopbarCustomers/>
					<TopbarForBusiness/>
				</div>
			</div>
		</div>
	)
}