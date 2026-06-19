import Image from 'next/image'
import { FiCheckCircle } from 'react-icons/fi'
import {
  BROKER_NAME,
  BROKER_PHOTO_URL,
  BROKER_RATING,
  BROKER_REVIEW_COUNT,
  CRECI,
} from '../../lib/config'
import { brokerInitials, formatRating, reviewCountLabel, resolveRating } from '../../lib/broker'

/**
 * Trust card for the corretor, shown at the decision moment so the lead talks to
 * a person — not "another WhatsApp number" like a portal. Rating only appears once
 * real Google review data is wired (see BROKER_RATING in config).
 */
export default function PropertyBroker() {
  const rating = resolveRating(BROKER_RATING, BROKER_REVIEW_COUNT)

  return (
    <div className="flex items-center gap-3.5">
      {BROKER_PHOTO_URL ? (
        <Image
          src={BROKER_PHOTO_URL}
          alt={`${BROKER_NAME} — corretor de imóveis em Osasco`}
          width={56}
          height={56}
          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div
          aria-hidden="true"
          className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-black flex-shrink-0"
        >
          {brokerInitials(BROKER_NAME)}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-base font-black text-dark leading-tight">{BROKER_NAME}</p>
        <p className="inline-flex items-center gap-1 text-[10px] text-gray-500">
          <FiCheckCircle size={10} className="text-green-600" /> CRECI-SP {CRECI}
        </p>

        {rating ? (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-600">
            <span className="text-amber-500" aria-hidden="true">★</span>
            <span className="font-bold text-dark">{formatRating(rating.rating)}</span>
            <span className="text-gray-300">·</span>
            <span>{reviewCountLabel(rating.reviewCount)}</span>
          </p>
        ) : (
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Responde rápido no WhatsApp
          </p>
        )}
      </div>
    </div>
  )
}
